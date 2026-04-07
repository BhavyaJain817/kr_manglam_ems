// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // Analytics is optional and client-side only

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6QQ-QCPsFiJZTeWUAk9TQ7dMguwfgb-Y",
    authDomain: "mohitproject-4807f.firebaseapp.com",
    projectId: "mohitproject-4807f",
    storageBucket: "mohitproject-4807f.firebasestorage.app",
    messagingSenderId: "151356740892",
    appId: "1:151356740892:web:f26959101006cc69b856d9",
    measurementId: "G-DLJXZ9L1XV"
};

// Initialize Firebase (checking length avoids re-initializing during hot reloading)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);