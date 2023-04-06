import React from "react";
import { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { getAuth, updateProfile } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); //생략가능 대신 userObj 활용
  const [userObj, setUserObj] = useState(null);
  //console.log(authService.currentUser);
  let userName = "";
  useEffect(() => {
    const auth = getAuth();
    authService.onAuthStateChanged(async (user) => {
      //로그인 또는 로그아웃에 호출
      if (user) {
        if (user.displayName === null) {
          const name = user.email.split("@")[0];
          await updateProfile(user, { displayName: name });
        }
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) =>
            updateProfile(user, { displayName: user.displayName }),
        });
        setIsLoggedIn(true);
        if (user.displayName === null) {
          const name = user.email.split("@")[0];
          user.updateProfile({ displayName: name });
          console.log(name);
        }
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    // console.log(authService.currentUser.displayName);
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) =>
        updateProfile(user, { displayName: user.displayName }),
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
