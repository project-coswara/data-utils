const firebase = require('firebase');

const firebaseConfig = {
    apiKey: "AIzaSyBrn-GzdCeMBPptk-_Ml3PpXtgbmAP6KZA",
    authDomain: "project-coswara.firebaseapp.com",
    databaseURL: "https://project-coswara.firebaseio.com",
    projectId: "project-coswara",
    storageBucket: "project-coswara.appspot.com",
    messagingSenderId: "70066812418",
    appId: "1:70066812418:web:5deaf3fd2189a19e63d91b",
    measurementId: "G-MCWN0Q7MX0"
};

// let firebaseApp = firebase.initializeTestApp({projectId: 'project-coswara', auth: { uid: 'alice'}})
let firebaseApp = firebase.initializeApp(firebaseConfig)
let db = firebaseApp.firestore();
db.settings({
    host: "localhost:8080",
    ssl: false
});

const dateString = '2020-04-25';

firebase.auth().signInAnonymously().then(() => {
    console.log('Logged In')
    let user = firebase.auth().currentUser;
    console.log('User ID', user.uid)
    db.collection("USER_METADATA")
        .doc(dateString)
        .collection('DATA')
        .doc(user.uid).set({
        'l_c': 'India',
        'l_s': 'Kerala',
        'g': 'female',
        'covid_status': 'healthy',
        'dT': 'web'
    }).then(() => {
        console.log('Data Added')
    });
    db.collection("USER_METADATA")
        .doc(dateString)
        .collection('DATA')
        .doc(user.uid).update({
        'iF': true
    }).then(() => {
        console.log('Data Updated')
    });
})