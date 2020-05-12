const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("../others/serviceAccountKey.json"),
  databaseURL: "https://project-coswara.firebaseio.com"
})

userId = '9XKj7fAmvwPUas9GFPZuTpev7T03'

admin.firestore().collection('USER_APPDATA').doc(userId).get().then((appData) => {
  admin.firestore().collection('USER_METADATA').doc(appData.data()['dS'])
    .collection('DATA').doc(userId).get().then((metaData) => {
      console.log(userId, {...appData.data(), ...metaData.data()})
  })
})
