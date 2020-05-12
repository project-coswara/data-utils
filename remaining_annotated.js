const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("../others/serviceAccountKey.json"),
  databaseURL: "https://project-coswara.firebaseio.com"
})

admin.firestore().collection('USER_APPDATA')
  .where('cS', '==', 'done')
  .where('dS', '<=', '2020-05-06')
  .get().then((snapshots) => {
    console.log(`Remaining data: ${snapshots.size}`)
})