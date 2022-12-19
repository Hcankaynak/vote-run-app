import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics.app.name)