import 'dotenv/config';
import admin from 'firebase-admin';

const nodeEnv = process.env.NODE_ENV || 'development';
const firestoreEmulatorHost = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
const serviceAccount = (process.env.FIREBASE_ACCOUNT_PATH as string) || '';

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.initializeApp();
}

const db = admin.firestore();
if (nodeEnv == 'development') {
  db.settings({
    host: firestoreEmulatorHost,
    ssl: false,
  });
}

export { db };