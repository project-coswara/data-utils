const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("../others/serviceAccountKey.json"),
  databaseURL: "https://project-coswara.firebaseio.com"
})

const db = admin.firestore()

db.collection('ANNOTATE_ERRORS').get().then((snapshots) => {
  snapshots.forEach((doc) => {
    const userData = doc.data();
    db.collection('USER_APPDATA').doc(doc.id).get().then((userDoc) => {
      console.log(userDoc.id, userDoc.data(), userData['n'], userData['aU'])
    })
  })
})
