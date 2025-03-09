import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBn2l-9oSdfgrJPcXyy0YlNPnwnpL-yhlg",
    authDomain: "farmeggs-1ad81.firebaseapp.com",
    projectId: "farmeggs-1ad81",
    storageBucket: "farmeggs-1ad81.firebasestorage.app",
    messagingSenderId: "589014267000",
    appId: "1:589014267000:web:8dece7ad77392e3cdde98d",
    measurementId: "G-HTY0H2439F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export { auth };
