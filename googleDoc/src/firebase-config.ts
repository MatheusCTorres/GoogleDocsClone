// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC19hcDPeqqvL93QfozBzWBn490N6bVPs0",
  authDomain: "docs-clone-e2460.firebaseapp.com",
  projectId: "docs-clone-e2460",
  storageBucket: "docs-clone-e2460.firebasestorage.app",
  messagingSenderId: "988907903989",
  appId: "1:988907903989:web:537b83ac895291d60a1ebc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
