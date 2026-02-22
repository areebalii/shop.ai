// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsnA8_yTMEg4dmBS8wb4d7J4s5GQ69DII",
  authDomain: "shopai-24c5c.firebaseapp.com",
  projectId: "shopai-24c5c",
  storageBucket: "shopai-24c5c.firebasestorage.app",
  messagingSenderId: "658901447447",
  appId: "1:658901447447:web:88f962eaebdfade292bd52"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();