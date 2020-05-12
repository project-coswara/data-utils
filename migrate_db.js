const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("../others/serviceAccountKey.json"),
  databaseURL: "https://project-coswara.firebaseio.com"
})

const db = admin.firestore();

db.collection('USERS').orderBy('cS').get().then((snapshots) => {
  snapshots.forEach((doc) => {
    const userId = doc.id;
    const userData = doc.data();
    Promise.all([
      db.collection('HEALTH_DATA').doc(userId).get(),
      db.collection('METADATA').doc(userId).get()
    ]).then((results) => {
      const healthData = results[0].data();
      const metaData = results[1].data();
      const dateString = userData['mDD'].substring(0, 10)
      const batch = db.batch();
      const userAppData = {
        'cS': userData['cS'],
        'cSD': userData['cSD'],
        'fV': userData['fUV'],
        'lV': userData['lUV'],
        'dS': dateString,
        'fMD': userData['aMD']
      }
      // const userMetaData = {
      //   a: metaData['a'],
      //   ep: metaData['ep'],
      //   g: metaData['g'],
      //   l_c: metaData['l_c'],
      //   l_s: metaData['l_s'],
      //   l_l: metaData['l_l'],
      //   dT: 'web',
      // }
      const userMetaData = {...metaData, ...healthData}
      userMetaData['dT'] = 'web'
      if (userData['cS'] === 'done') {
        userMetaData['iF'] = true
      }
      batch.set(
        db.collection('USER_APPDATA').doc(userId),
        userAppData
      )
      batch.set(
        db.collection('USER_METADATA').doc(dateString).collection('DATA').doc(userId),
        userMetaData
      )
      batch.commit().then(() => {
        console.log('Migrated user:', userId)
      })
    })
  })
})
