import React from "react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService, dbService, storageService } from "../fbase";
import { updateProfile } from "@firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "@firebase/firestore";

function Profile({ refreshUser, userObj }) {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    history.push("/");
    authService.signOut();
  };
  const getMyNweets = async () => {
    const nweets = query(
      collection(dbService, "nweets"),
      where("creatorld", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(nweets);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    // let PhotoUrl = "";
    // const userPhotoRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
    // PhotoUrl = await getDownloadURL(userPhotoRef);

    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      //photoURL
      refreshUser();
    }
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          autoFocus
          placeholder="Display name"
          onChange={onChange}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
}
export default Profile;
