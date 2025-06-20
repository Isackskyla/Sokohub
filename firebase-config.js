// firebase-config.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFtZdjqv03GnogYyQy_OMXxhmnNHLSMrM",
  authDomain: "sokohub-38103.firebaseapp.com",
  projectId: "sokohub-38103",
  storageBucket: "sokohub-38103.appspot.com",
  messagingSenderId: "765168744986",
  appId: "1:765168744986:web:bc606817607b5d20a32fa3",
  measurementId: "G-16TYMXFD9Z"
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Export auth for use in other modules
export const firebaseApp = app; // Export app if needed elsewhere

