const admin = require("firebase-admin");
const serviceAccount = require("../others/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://project-coswara.firebaseio.com"
})

admin.firestore().collection('USERS').where('cS', '==', 'done').where('lUV', '==', 1.2).get().then((snapshot) => {
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
    });
})
