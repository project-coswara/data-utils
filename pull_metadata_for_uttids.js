const fs = require('fs');
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("../others/serviceAccountKey.json"),
  databaseURL: "https://project-coswara.firebaseio.com"
})

const db = admin.firestore();
const dateString = '2020-04-13'
const outputDir = `../data/metadata/${dateString}`
if (!fs.existsSync(outputDir)){
  fs.mkdirSync(outputDir);
}

fs.readFile('./20200413_ids.txt', function(err, data) {
  if (err) throw err;
  let array = data.toString().split("\n");
  const promises = []
  for (let i in array) {
    // console.log('Processing user', array[i]);
    const userId = array[i]
    promises.push(db.collection('USER_METADATA').doc(dateString).collection('DATA').doc(userId).get());
  }
  Promise.all(promises).then((results) => {
    results.forEach((doc) => {
      if (doc.exists) {
        const userDataLoc = `${outputDir}/${doc.id}`;
        if (!fs.existsSync(userDataLoc)){
          fs.mkdirSync(userDataLoc);
        }
        const metaDataJSON = `${userDataLoc}/metadata.json`
        let metaData = {
          'id': doc.id
        }
        metaData = Object.assign(metaData, doc.data())
        fs.writeFileSync(metaDataJSON, JSON.stringify(metaData, null, 4));
      }
    })
  })
})
