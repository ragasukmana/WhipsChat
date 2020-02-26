import Firebase from 'firebase';

var firebaseConfig = {
  apiKey: 'AIzaSyB7Owi228o2DjkV8R-2TF3WzhjyWWyn5eM',
  authDomain: 'whipschat.firebaseapp.com',
  databaseURL: 'https://whipschat.firebaseio.com',
  projectId: 'whipschat',
  storageBucket: 'whipschat.appspot.com',
  messagingSenderId: '572953950915',
  appId: '1:572953950915:web:1e87132065e03ca6a68076',
  measurementId: 'G-H2C4XQ6T24',
};

let firebaseApp = Firebase.initializeApp(firebaseConfig);
// const db = app.database();
export {firebaseApp};
