import React from "react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService, dbService } from "../fbase";
import { updateProfile } from "@firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "@firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

function Profile({ refreshUser, userObj }) {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [newPhotoURL, setNewPhotoURL] = useState(userObj.photoURL);
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

    let PhotoUrl = "";
    const userPhotoRef = ref(getStorage(), `${userObj.uid}/${uuidv4()}`);
    await uploadString(userPhotoRef, newPhotoURL, "data_url");
    PhotoUrl = await getDownloadURL(userPhotoRef);

    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
        photoURL: PhotoUrl,
      });
      //photoURL
      refreshUser();
    }
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader(); //파일을 갖고 reader을 만들고
    //readAsDataURL이 끝나면 onloadend 실행
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setNewPhotoURL(result);
    };
    reader.readAsDataURL(theFile); //readAsDataURL을 사용해서 파일을 읽는다.
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <img src={newPhotoURL} className="profileUserImg" />
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            position: "relative",
            opacity: 0,
            bottom: "80px",
            cursor: "pointer",
          }}
        />
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
