const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("../others/serviceAccountKey.json"),
  databaseURL: "https://project-coswara.firebaseio.com"
})

const db = admin.firestore();

const getDateStringWithOffset = function (dateString, offset) {
  const dateStringISO = `${dateString}T00:00:00.000Z`;
  const dataObject = new Date(dateStringISO);
  dataObject.setDate(dataObject.getDate() + offset);
  return dataObject.toISOString().substring(0, 10);
};

const startDateString = '2020-04-10'
for(const i of Array(28).keys()) {
  const dateString = getDateStringWithOffset(startDateString, i)
  const dateSummary = {
    'visited': 0,
    'completed': 0,
    'positive_mild': 0,
    'positive_moderate': 0,
    'recovered_full': 0,
    'resp_illness_not_identified': 0,
    'no_resp_illness_exposed': 0,
    'healthy': 0,
    'web_users': 0,
    'android_users': 0,
    'ios_users': 0,
    'gender_male': 0,
    'gender_female': 0,
    'gender_other': 0
  }
  const locationSummary = {}
  console.log('Processing date:', dateString)
  db.collection('USER_METADATA').doc(dateString).collection('DATA').get().then((snapshots) => {
    snapshots.forEach((doc) => {
      const userData = doc.data();
      const deviceType = userData['dT'] || 'web'
      dateSummary.visited += 1
      if (userData['iF']) {
        dateSummary.completed += 1
        dateSummary[userData['covid_status']] += 1
        dateSummary[`${deviceType}_users`] += 1
        dateSummary[`gender_${userData['g']}`] += 1
        locationSummary[userData['l_c']] = (locationSummary['l_c'] ? locationSummary['l_c'] : 0) + 1
      }
    })
    const batch = db.batch();
    batch.set(
      db.collection('USER_METADATA').doc(dateString),
      dateSummary
    );
    batch.set(
      db.collection('USER_METADATA').doc(dateString).collection('STATS').doc('l_c'),
      locationSummary
    );
    batch.commit().then(() => {
      console.log('Updated stats:', dateString)
    })
  })
}
