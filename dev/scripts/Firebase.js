import firebase from "firebase";

var config = {
  apiKey: "AIzaSyCcor9lk5CY13skZxPbh3Uu6n_qt7pPsRU",
  authDomain: "project-6-cb9b9.firebaseapp.com",
  databaseURL: "https://project-6-cb9b9.firebaseio.com",
  projectId: "project-6-cb9b9",
  storageBucket: "project-6-cb9b9.appspot.com",
  messagingSenderId: "867871134057"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;