import React from "react";
import { dbService, storageService } from "../fbase";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "@firebase/storage"; // <= 정리 전에 ref가 여기 들어 있었음.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const [userPhoto, setUserPhoto] = useState(userObj.photoURL);
  const [userName, setUserName] = useState(userObj.displayName);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줍니다.
  const day = currentDate.getDate();
  const now = `${year}.${month}.${day}`;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (nweet === "") {
      return;
    }
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }

    //테스트 용 프로릴 사진
    // let photosUrl = "";
    // const photosRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
    // const responsePhoto = await uploadString(photosRef, "data_url");
    // photosUrl = await getDownloadURL(responsePhoto.ref);
    const uid = userObj.uid;
    const nweetUid = uid.slice(0, 3) + "*".repeat(uid.length - 25);

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      // photosUrl, // <= 테스트
      photo: userPhoto,
      Name: userName,
      uid: nweetUid,
      date: now,
      attachmentUrl,
    };
    try {
      const docRef = await addDoc(collection(dbService, "nweets"), nweetObj);
      setNweet("");
      setAttachment("");
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const onChange = (event) => {
    //'event로 부터' 라는 의미. 즉 event 안에 있는 target 안에 있는 value를 달라고 한다.
    const {
      target: { value },
    } = event;
    setNweet(value);
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
      setAttachment(result);
    };
    reader.readAsDataURL(theFile); //readAsDataURL을 사용해서 파일을 읽는다.
  };
  const onClearAttachment = () => setAttachment("");

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input
          type="submit"
          value="&rarr;"
          className="factoryInput__arrow"
          style={{ zIndex: 11, cursor: "pointer" }}
        />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          position: "relative",
          opacity: 0,
          bottom: "18px",
          cursor: "pointer",
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
