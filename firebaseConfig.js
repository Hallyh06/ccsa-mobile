// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzbeGwLJISzRWW9GoEhJSunv27OCjEMe0",
    authDomain: "ccsa-farmerregistration.firebaseapp.com",
    projectId: "ccsa-farmerregistration",
    storageBucket: "ccsa-farmerregistration.firebasestorage.app",
    messagingSenderId: "707354029387",
    appId: "1:707354029387:web:3d53a0b4ec3e2befb34cce",
    measurementId: "G-61YGY8LGJG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
