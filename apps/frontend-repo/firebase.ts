import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBL3Cc26i9eHtViF9fO2HVatXcKrROJ-xM",
  authDomain: "ebuddy-e70b1.firebaseapp.com",
  projectId: "ebuddy-e70b1",
  storageBucket: "ebuddy-e70b1.firebasestorage.app",
  messagingSenderId: "929478376410",
  appId: "1:929478376410:web:4a4997dcc64fb4f2f19ee3",
  measurementId: "G-B3936LF37D",
};

const nodeEnv = process.env.NODE_ENV || "development";
const firestoreEmulatorHost =
  process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1";
const authEmulatorHost =
  process.env.FIREBASE_AUTH_EMULATOR_HOST || "http://127.0.0.1:9099";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Use emulator for development
if (nodeEnv === "development") {
  connectAuthEmulator(auth, authEmulatorHost);
  connectFirestoreEmulator(db, firestoreEmulatorHost, 8080);
}

export { auth, db };
