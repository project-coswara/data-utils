const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert("../others/serviceAccountKey.json"),
    databaseURL: "https://project-coswara.firebaseio.com"
})

const prevDateString = '2020-04-18'
const dateString = '2020-04-19';

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

Promise.all([
    admin.firestore().collection('COLLECT_STATS').doc(prevDateString).get(),
    admin.firestore().collection('COLLECT_STATS').doc(prevDateString).collection('STATS').doc('l_c').get(),
    admin.firestore().collection('USER_METADATA').doc(dateString).get(),
    admin.firestore().collection('USER_METADATA').doc(dateString).collection('STATS').doc('l_c').get()
]).then((snapshots) => {
    if (snapshots[0].exists) {
        summary = snapshots[0].data()
    }
    if (snapshots[1].exists) {
        locationSummary = snapshots[1].data()
    }
    let totalSummary = {}
    let totalLocationSummary = {}
    if (snapshots[2].exists) {
        let dateSummary = snapshots[2].data()
        Object.keys({...summary, ...dateSummary}).forEach((key) => {
            totalSummary[key] = (summary[key] ? summary[key]: 0) + (dateSummary[key] ? dateSummary[key] : 0)
        })
    }
    if (snapshots[3].exists) {
        let dateLocationSummary = snapshots[3].data()
        Object.keys({...locationSummary, ...dateLocationSummary}).forEach((key) => {
            totalLocationSummary[key] = (locationSummary[key] ? locationSummary[key] : 0) + (dateLocationSummary[key] ? dateLocationSummary[key] : 0)
        })

    }
    let batch = admin.firestore().batch();
    batch.set(
        admin.firestore().collection('COLLECT_STATS').doc(dateString),
        totalSummary
    )
    batch.set(
        admin.firestore().collection('COLLECT_STATS').doc(dateString).collection('STATS').doc('l_c'),
        totalLocationSummary
    )
    batch.commit().then()
    console.log(totalSummary)
    console.log(totalLocationSummary)
})
