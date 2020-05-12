const fs = require('fs');
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("../others/serviceAccountKey.json"),
  databaseURL: "https://project-coswara.firebaseio.com"
})

const db = admin.firestore();


fs.readFile('./annotated.txt', function(err, data) {
  if(err) throw err;
  let array = data.toString().split("\n");
  for(let i in array) {
    // console.log('Processing user', array[i]);
    const userId = array[i]
    const userRef = db.collection('USER_APPDATA').doc(userId)
    db.runTransaction((transaction => {
      return transaction.get(userRef).then((doc) => {
        if(doc.exists) {
          console.log('Updating user', doc.id, doc.data())
          return transaction.update(doc.ref, {'cS': 'verified_offline'})
        } else {
          return Promise.resolve()
        }
      }).then(() => {
        console.log('Transaction complete for', userId)
      }).catch((error) => {
        // console.log('user not found', array[i])
      })
    }))
  }
});

