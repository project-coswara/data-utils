const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("../others/serviceAccountKey.json"),
  databaseURL: "https://project-coswara.firebaseio.com"
})

const annotatorId = 'rUKbA7AB7OX7qsFhyBlFZUCrOtQ2'
admin.firestore().collection('ANNOTATE_APPDATA').doc(annotatorId)
  .collection('DATA')
  .where('fA', '==', false).get().then((snapshots) => {
    snapshots.forEach((doc) => {
      console.log(doc.id, doc.data())
    })
})