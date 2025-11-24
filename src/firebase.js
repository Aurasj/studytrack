import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAl0TQvMWMOf5l29t44cBlzzknYm81gvKE",
    authDomain: "studytrack-app.firebaseapp.com",
    projectId: "studytrack-app",
    storageBucket: "studytrack-app.firebasestorage.app",
    messagingSenderId: "228461449032",
    appId: "1:228461449032:web:bd698d8fd9c6f4d24bed7d",
    measurementId: "G-36YHVSLRM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
