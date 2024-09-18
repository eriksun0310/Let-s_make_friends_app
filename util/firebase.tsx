import firebase from "firebase/app";
import 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
  };


  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }

export {
    firebase
}