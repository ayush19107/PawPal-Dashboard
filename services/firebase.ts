import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCR8mFkrOAMKsiyAI5OA3v4YbuZnZgdaVM",
  authDomain: "pawpal-de4c4.firebaseapp.com",
  databaseURL: "https://pawpal-de4c4-default-rtdb.firebaseio.com",
  projectId: "pawpal-de4c4",
  storageBucket: "pawpal-de4c4.firebasestorage.app",
  messagingSenderId: "969517785647",
  appId: "1:969517785647:web:336d2288c5c31599af5cda",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
