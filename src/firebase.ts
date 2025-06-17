import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC03sZEqGGlxdN8coCqyEuK5wIjDawJi_0",
  authDomain: "personeltakipsistemi-7d2f3.firebaseapp.com",
  projectId: "personeltakipsistemi-7d2f3",
  storageBucket: "personeltakipsistemi-7d2f3.firebasestorage.app",
  messagingSenderId: "855721389714",
  appId: "1:855721389714:web:c11bf83c1bcba12529804b",
  measurementId: "G-GL6HT4N5Q9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
