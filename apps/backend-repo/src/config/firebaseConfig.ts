import "dotenv/config";
import admin from "firebase-admin";

const serviceAccount = process.env.FIREBASE_ACCOUNT_PATH as string;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };
