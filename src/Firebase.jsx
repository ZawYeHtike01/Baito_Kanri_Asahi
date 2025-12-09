import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCiuCnZkELa5qgAXxfTUbsGi5G6MR3o8-0",
  authDomain: "baito-kanri-asahi.firebaseapp.com",
  projectId: "baito-kanri-asahi",
  storageBucket: "baito-kanri-asahi.firebasestorage.app",
  messagingSenderId: "19243271568",
  appId: "1:19243271568:web:f7725c11af3ec48c33df15",
  measurementId: "G-H8E8Y7K7SK"
};

const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const auth=getAuth(app);

