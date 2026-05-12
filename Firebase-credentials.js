// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_bzY-Z8konsf7vZcn1Mgn3IJOB8wgS6M",
  authDomain: "ibadify-e0083.firebaseapp.com",
  projectId: "ibadify-e0083",
  storageBucket: "ibadify-e0083.firebasestorage.app",
  messagingSenderId: "347151430725",
  appId: "1:347151430725:web:b24a187babe4725d669f2c",
  measurementId: "G-GQG8NF77HN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);