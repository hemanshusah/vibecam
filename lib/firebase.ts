import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA0Ss977bZXgKaHdqTv6Rd4FKLeD30uVLY",
  authDomain: "vibecam-66a0e.firebaseapp.com",
  projectId: "vibecam-66a0e",
  storageBucket: "vibecam-66a0e.firebasestorage.app",
  messagingSenderId: "370651030523",
  appId: "1:370651030523:web:c6efa4c6530e70e22f215e",
  measurementId: "G-5LN6WP875H"
};

// Initialize Firebase (SSR Safe)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Analytics is client-side only
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

export { app, auth, analytics };
