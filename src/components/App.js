import React from "react";
import { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { updateProfile } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); //생략가능 대신 userObj 활용
  const [userObj, setUserObj] = useState(null);
  //console.log(authService.currentUser);
  useEffect(() => {
    authService.onAuthStateChanged(async (user) => {
      //로그인 또는 로그아웃에 호출

      if (user) {
        if (user.displayName === null) {
          const name = user.email.split("@")[0];
          await updateProfile(user, { displayName: name });
        }
        if (user.photoURL === null) {
          user.photoURL =
            "https://firebasestorage.googleapis.com/v0/b/nwiiter-9530c.appspot.com/o/blank-profile-picture-ge4ff853e7_1280.png?alt=media&token=f0d564f8-16a1-48f5-bc0a-1f50555c2e70";
        }
        setUserObj({
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
          updateProfile: (args) =>
            updateProfile(user, {
              displayName: user.displayName,
              photoURL: user.photoURL,
              uid: user.uid,
            }),
        });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    // console.log(authService.currentUser.photoURL);
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
      updateProfile: (args) =>
        updateProfile(user, {
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        }),
    });
    // setUserObj(Object.assign({}, user));
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
