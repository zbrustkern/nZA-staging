import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  projectId: "snipit-46a75",
  appId: "1:1014221735596:web:3e507554e4c9e3d61cc109",
  storageBucket: "snipit-46a75.firebasestorage.app",
  apiKey: "AIzaSyBmkQEEW_yla-B1FbYr7eSQnt4DAIFaBjM",
  authDomain: "snipit-46a75.firebaseapp.com",
  messagingSenderId: "1014221735596",
  measurementId: "G-8QF61NVJQP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, "us-central1");

// Auth Provider
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
