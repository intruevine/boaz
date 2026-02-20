// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBR8GttB5nzm-lCLjo9MVKOHurlrdF6fWE",
  authDomain: "shalom-s-singing-voice.firebaseapp.com",
  projectId: "shalom-s-singing-voice",
  storageBucket: "shalom-s-singing-voice.firebasestorage.app",
  messagingSenderId: "686506198972",
  appId: "1:686506198972:web:7945630eca27dc075d8db9",
  measurementId: "G-MZ9HM133M7"
};

// Initialize Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);