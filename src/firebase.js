import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQQF-4iL2UGiveXeTreNX1kfTpzEuiRFI",
  authDomain: "luca-koch.firebaseapp.com",
  projectId: "luca-koch",
  storageBucket: "luca-koch.firebasestorage.app",
  messagingSenderId: "765783564842",
  appId: "1:765783564842:web:f11f26d88cb01506379953",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
