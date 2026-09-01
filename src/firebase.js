import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQQF-4iL2UGiveXeTreNX1kfTpzEuiRFI",
  authDomain: "luca-koch.firebaseapp.com",
  projectId: "luca-koch",
  storageBucket: "luca-koch.firebasestorage.app",
  messagingSenderId: "765783564842",
  appId: "1:765783564842:web:f11f26d88cb01506379953",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
