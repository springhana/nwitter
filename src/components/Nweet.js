import React from "react";
import { dbService, storageService } from "../fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "@firebase/storage";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

function Nweet({ nweetObj, isOwner }) {
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    console.log(ok);
    if (ok) {
      await deleteDoc(NweetTextRef);
      await deleteObject(
        ref(storageService, nweetObj.attachmentUrl, nweetObj.userPhoto)
      );
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    // console.log(nweetObj, newNweet);
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });
    toggleEditing();
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit your nweet"
              value={newNweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          {/* 테스트 용 img */}
          <img src={nweetObj.photo} className="nweet_userImg" />
          <div className="nweet_userName">
            {nweetObj.Name}({nweetObj.uid})님의 글 - {nweetObj.date}
          </div>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <>
              <div className="nweet_border"></div>
              <div className="nweet_imgPic">
                <img src={nweetObj.attachmentUrl} className="nweet_img" />
              </div>
            </>
          )}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Nweet;
