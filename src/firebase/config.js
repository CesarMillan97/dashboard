import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
   apiKey: "AIzaSyBkW0nTfE67t9dx-RZfC2KrHKzEbjn0dHw",
   authDomain: "dashboard-site-76a6e.firebaseapp.com",
   projectId: "dashboard-site-76a6e",
   storageBucket: "dashboard-site-76a6e.appspot.com",
   messagingSenderId: "1056639689950",
   appId: "1:1056639689950:web:83b250388ee55468120e4f"
 };

//  init
firebase.initializeApp(firebaseConfig)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

// timestamp 
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, projectStorage, timestamp }
