import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBh1fpL0g-aKHk3aHTW6LIPO1-_UfZMbCw",
  authDomain: "photography-4ad6c.firebaseapp.com",
  projectId: "photography-4ad6c",
  storageBucket: "photography-4ad6c.firebasestorage.app",
  messagingSenderId: "10750906691",
  appId: "1:10750906691:web:e731775af1106f1ff6",
  measurementId: "G-TFX1CVHLG3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);