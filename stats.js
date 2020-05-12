const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert("../others/serviceAccountKey.json"),
    databaseURL: "https://project-coswara.firebaseio.com"
})

const getDateStringWithOffset = function (dateString, offset) {
    const dateStringISO = `${dateString}T00:00:00.000Z`;
    const dataObject = new Date(dateStringISO);
    dataObject.setDate(dataObject.getDate() + offset);
    return dataObject.toISOString().substring(0, 10);
};

const dateString = '2020-04-10';
const nextDateString = getDateStringWithOffset(dateString, 1)
admin.firestore().collection('USERS').where('mDD', '>=',dateString).where('mDD', '<', nextDateString).get().then((snapshots) => {
    console.log(`${snapshots.size} users`)
    let summary = {
        'visited': 0,
        'completed': 0,
        'positive_mild': 0,
        'positive_moderate': 0,
        'recovered_full': 0,
        'resp_illness_not_identified': 0,
        'no_resp_illness_exposed': 0,
        'healthy': 0,
        'web_users': 0,
        'android_users': 0,
        'ios_users': 0,
        'gender_male': 0,
        'gender_female': 0,
        'gender_other': 0
    }
    let locationSummary = {}
    snapshots.forEach((doc) => {
        const userData = doc.data();
        const isUserCompleted = (userData['cS'] === 'done' || userData['cS'] === 'verified_offline' || userData['cS'] === 'verification_in_progress' || userData['cS'] === 'verified')
        summary.visited = summary.visited + 1
        summary.completed = summary.completed + (isUserCompleted ? 1 : 0)
        summary.web_users = summary.web_users + ((!userData['dT'] && isUserCompleted) || userData['dT'] === 'web' ? 1 : 0)
        summary.android_users = summary.android_users + (userData['dT'] && userData['dT'] === 'android' ? 1 : 0)
    })
    // console.log(healthDataPromises)
    Promise.all(snapshots.docs.map((snapshot) => {
        const userData = snapshot.data();
        const isUserCompleted = (userData['cS'] === 'done' || userData['cS'] === 'verified_offline' || userData['cS'] === 'verification_in_progress' || userData['cS'] === 'verified')
        if (isUserCompleted) {
            return admin.firestore().collection('HEALTH_DATA').doc(snapshot.id).get()
        }
    })).then((healthSnapshots) => {
        healthSnapshots.forEach((doc) => {
            if (doc) {
                const healthStatus = doc.data()['covid_status']
                summary[healthStatus] = summary[healthStatus] + 1
            }
        })
        Promise.all(snapshots.docs.map((snapshot) => {
            const userData = snapshot.data();
            const isUserCompleted = (userData['cS'] === 'done' || userData['cS'] === 'verified_offline' || userData['cS'] === 'verification_in_progress' || userData['cS'] === 'verified')
            if (isUserCompleted) {
                return admin.firestore().collection('METADATA').doc(snapshot.id).get()
            }
        })).then((metaDataSnapshots) => {
            metaDataSnapshots.forEach((doc) => {
                if (doc) {
                    const metaData = doc.data();
                    const l_c = metaData['l_c']
                    if (locationSummary[l_c]) {
                        locationSummary[l_c] = locationSummary[l_c] + 1
                    } else {
                        locationSummary[l_c] = 1
                    }
                    summary['gender_' + metaData['g']] = summary['gender_' + metaData['g']] + 1
                }
            })
            console.log(summary)
            console.log(locationSummary)
            let db = admin.firestore();
            let batch = db.batch();
            batch.set(
                db.collection('USER_METADATA').doc(dateString),
                summary
            )
            batch.set(
                db.collection('USER_METADATA').doc(dateString).collection('STATS').doc('l_c'),
                locationSummary
            )
            batch.commit().then();
        })
    })
})