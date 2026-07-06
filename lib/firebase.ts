import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let auth: any;
let db: any;
let storage: any;

try {
  const isMock = !firebaseConfig.apiKey || firebaseConfig.apiKey.startsWith("mock");
  
  if (!isMock) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    // Return dummy objects for mock mode to prevent crash on import
    app = { name: "[DEFAULT]-mock" } as any;
    auth = { currentUser: null } as any;
    db = {} as any;
    storage = {} as any;
  }
} catch (error) {
  console.warn("Firebase failed to initialize. Using mock mode fallback.", error);
  app = { name: "[DEFAULT]-mock" } as any;
  auth = { currentUser: null } as any;
  db = {} as any;
  storage = {} as any;
}

export { app, auth, db, storage };
export const isFirebaseMock = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.startsWith("mock");
