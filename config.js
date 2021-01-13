import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyCAYeS_Es7x7Ua6Madx1FFJ2UbTEypZKm8",
    authDomain: "book-santa-28b97.firebaseapp.com",
    projectId: "book-santa-28b97",
    storageBucket: "book-santa-28b97.appspot.com",
    messagingSenderId: "299256979522",
    appId: "1:299256979522:web:00f62bc20efaa16042cddb"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
