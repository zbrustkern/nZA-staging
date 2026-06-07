import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  projectId: "snipit-46a75",
  appId: "1:1014221735596:web:3e507554e4c9e3d61cc109",
  storageBucket: "snipit-46a75.firebasestorage.app",
  apiKey: "AIzaSyBmkQEEW_yla-B1FbYr7eSQnt4DAIFaBjM",
  authDomain: "snipit-46a75.firebaseapp.com",
  messagingSenderId: "1014221735596",
  measurementId: "G-8QF61NVJQP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
  process.exit(0);
}

checkUsers();
