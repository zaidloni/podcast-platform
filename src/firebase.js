// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0ifr4ucDSJgrefV7tbmWekSVCz0CKDNM",
  authDomain: "poadcast-app.firebaseapp.com",
  projectId: "poadcast-app",
  storageBucket: "poadcast-app.appspot.com",
  messagingSenderId: "59515684757",
  appId: "1:59515684757:web:93cefecef81c4466fc189c",
  measurementId: "G-7EQ5985QXL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { auth, db, storage };