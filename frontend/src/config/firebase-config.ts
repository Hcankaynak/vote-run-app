import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDPLQJPjoe_dcOEngCHEfEj3XJxueIszTI",
    authDomain: "answer-meter.firebaseapp.com",
    projectId: "answer-meter",
    storageBucket: "answer-meter.appspot.com",
    messagingSenderId: "48632146346",
    appId: "1:48632146346:web:ebaaf75c5b74445bdc23d3",
    measurementId: "G-MMCHCR060E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

console.log(analytics.app.name)