const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("../others/serviceAccountKey.json"),
  databaseURL: "https://project-coswara.firebaseio.com"
})

const db = admin.firestore();
const participantId = 'jfyfv7XuCqa3fdlxYehlW64Mc2e2';

db.collection('ANNOTATE_ERRORS').doc(participantId).get().then((doc) => {
  if (doc.exists) {
    const annotatorId = doc.data()['aU'];
    const batch = db.batch();
    batch.delete(
      db.collection('ANNOTATE_APPDATA').doc(annotatorId)
        .collection('DATA').doc(participantId)
    );
    batch.delete(
      doc.ref
    )
    batch.update(
      db.collection('USER_APPDATA').doc(participantId),
      {'cS': 'annotate_issue'}
    )
    batch.commit().then(() => {
      console.log('ISSUE FIXED FOR ID:', participantId)
    });
  }
})
