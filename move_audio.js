const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("../others/serviceAccountKey.json"),
  databaseURL: "https://project-coswara.firebaseio.com",
  storageBucket: 'project-coswara.appspot.com',
})

// const userId = '1YKLwejE06Poo1Whg1sYL3EC8sz2'
// const dateString = '2020-04-15'
const recordStages = ['breathing-shallow', 'breathing-deep', 'cough-shallow', 'cough-heavy', 'vowel-a', 'vowel-e', 'vowel-o',
  'counting-normal', 'counting-fast']
admin.firestore().collection('USERS').orderBy('cS').get().then((snapshots) => {
  snapshots.forEach((doc) => {
    if (doc.exists) {
      const docData = doc.data()
      const dateString = docData['mDD'].substring(0, 10)
      const userId = doc.id;
      console.log(userId, dateString, docData['cS'])
      recordStages.forEach((key) => {
        admin.storage().bucket().file(`AUDIO_DATA/${userId}/${key}.wav`)
          .move(`COLLECT_DATA/${dateString}/${userId}/${key}.wav`).then(() => {
          console.log('Moved file:', `AUDIO_DATA/${userId}/${key}.wav`, 'to', `COLLECT_DATA/${dateString}/${userId}/${key}.wav`)
        }).catch((error) => {
          console.log("ERROR: file doesn't exist", `AUDIO_DATA/${userId}/${key}.wav`)
        })
      })
    }
  })
})



