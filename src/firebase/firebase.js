// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJrqiGEwS8DaxMkvaobfrM9XzD15H4O1I",
  authDomain: "userroles-608e5.firebaseapp.com",
  databaseURL: "https://userroles-608e5-default-rtdb.firebaseio.com",
  projectId: "userroles-608e5",
  storageBucket: "userroles-608e5.firebasestorage.app",
  messagingSenderId: "113944193775",
  appId: "1:113944193775:web:fcdbbf3a28d4fffb12891a",
  measurementId: "G-SZNQQ16K2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default firebaseConfig;
export {app, auth};
