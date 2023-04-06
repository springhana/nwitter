import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; //firebase에 데이터베이스를 사용하기 위한 import
import { getStorage } from "firebase/storage";

//.env 파일은 firebase.js 파일 안에 있는 값을 보안을 위해 키값 그대로가 아닌 다른 값으로 치환시키기 위해 존재하며, github같은 공용 웹사이트에 코드를 올릴 때 개인정보 보호겸 사용된다.
//.env에서 변수를 만들시 React_App_변수명
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const authService = getAuth();
export const dbService = getFirestore();
export const storageService = getStorage();
