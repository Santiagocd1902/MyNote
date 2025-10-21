# MyNote
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrtqLMPIE-vlWaomS0Mp9J4szRlTuBELg",
  authDomain: "mynote-b2361.firebaseapp.com",
  projectId: "mynote-b2361",
  storageBucket: "mynote-b2361.firebasestorage.app",
  messagingSenderId: "509573488809",
  appId: "1:509573488809:web:7e9b7a8eae79377d7dc9b8",
  measurementId: "G-0EK8SSBC4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);