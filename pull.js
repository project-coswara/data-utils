const admin = require("firebase-admin");
const fs = require('fs');
const path = require("path");
const serviceAccount = require("../others/serviceAccountKey.json");

const version = 1.2

const dataLoc = path.resolve('../data/20200415')
if (!fs.existsSync(dataLoc)){
    fs.mkdirSync(dataLoc);
}

const pullDataScript = `${dataLoc}/pull_data.sh`
const pDS = fs.createWriteStream(pullDataScript, {
    flags: 'w'
})

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://project-coswara.firebaseio.com"
})

admin.firestore().collection('USERS')
    .where('cS', '==', 'done')
    .where('lUV', '==', version)
    .where('cSD', '>=', '2020-04-15T11:04:21.776Z').get().then(function userFilter(snapshot) {
    console.log(`Fetched ${snapshot.size} users`)
    snapshot.forEach((doc) => {
        let userDataLoc = `${dataLoc}/${doc.id}`
        let metaDataJSON = `${userDataLoc}/metadata.json`
        if (!fs.existsSync(userDataLoc)){
            fs.mkdirSync(userDataLoc);
        }
        let userData = doc.data();
        let metaData = {
            'id': doc.id,
            'date': userData['cSD']
        }
        console.log(userData)
        // let dataPromises = [
        //     admin.firestore().collection('METADATA').doc(doc.id).get(),
        //     admin.firestore().collection('HEALTH_DATA').doc(doc.id).get()
        // ]
        // Promise.all(dataPromises).then((promiseData) => {
        //     promiseData.forEach((metaDataSnapshot) => {
        //         if (metaDataSnapshot.exists) {
        //             metaData = Object.assign(metaData, metaDataSnapshot.data())
        //         }
        //     })
        //     fs.writeFileSync(metaDataJSON, JSON.stringify(metaData));
        // })
        // pDS.write(`gsutil -m cp -R gs://project-coswara.appspot.com/AUDIO_DATA/${doc.id} ${dataLoc}\n`)
    })
})

