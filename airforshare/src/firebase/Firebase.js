import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue ,remove } from "firebase/database";
import { getStorage, ref as storageRef,uploadBytesResumable, getDownloadURL } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyA73B7UBnxbeUyTAHaN6ZWY14C7HM3BlKo",
  authDomain: "dogology-6ba71.firebaseapp.com",
  projectId: "dogology-6ba71",
  storageBucket: "dogology-6ba71.appspot.com",
  messagingSenderId: "269882674700",
  appId: "1:269882674700:web:c58eae1fb3ab68d368e829"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const storage = getStorage();

export {
    app,
    db,
    ref,
    set,
    onValue ,
    remove,
    storage,
    storageRef,
    uploadBytesResumable,
     getDownloadURL
}