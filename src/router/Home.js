import React from "react";
import { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import Nweet from "../components/Nweet";
import NweetFactory from "../components/NweetFactory";

function Home({ userObj }) {
  // console.log(userObj);

  const [nweets, setNweets] = useState([]);

  // 밑에 방식은 오래된 방법이다. <- 오래된 데이터를 가져온다. 새로 생성/변경된 데이터는 새로고침 반영
  // const getNweets = async () => {
  //   const dbNweets = query(collection(dbService, "nweets"));
  //   const querySnapshot = await getDocs(dbNweets);
  //   querySnapshot.forEach((document) => {
  //     //console.log(document.data())
  //     const nweetObject = {
  //       ...document.data(),
  //       id: document.id,
  //       creatorId: 1212,
  //     };
  //     setNweets((prev) => [nweetObject, ...prev]); // <- ...prev : set이 붙는 함수를 쓸 때, 값 대신에 함수를 전달할 수 있다. 그리고 함수를 전달하면 리액트는 이전 값에 접근할 수 있게 해준다.
  //   });
  // };

  useEffect(() => {
    // getNweets();
    const dbNweets = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(dbNweets, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        //snapahot은 기본적으로 무언가 일어나면 데이터베이스에 무슨일이 있을 때, 알림을 받는다.
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);
  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}
export default Home;
