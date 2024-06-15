import React, {
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from "react";
import Peer from "simple-peer";
import { callUser, getFriendById } from "../util/api";
import io from "socket.io-client";
import Loadding from "./Loadding";
import "../resource/style/VideoCall/videocall.css";

export default function VideoCall() {
  const [friendData, setFriendData] = useState(null);
  const [meData, setMeData] = useState("");
  const [flag, setFlag] = useState("");
  const [stream, setStream] = useState("");
  const callerRef = useRef(null);
  const receiverRef = useRef(null);
  const connectionRef = useRef(null);
  const socket = useRef(null);
  socket.current = io("https://192.168.41.26");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setStream(stream);
        callerRef.current.srcObject = stream;
      });

    const fetch = async () => {
      const baseUrl = window.location.href;
      const friendId = baseUrl.split("id=")[1];
      const response = await callUser({ receiver: friendId });
      const f = baseUrl.slice(
        baseUrl.indexOf("flag") + 5,
        baseUrl.indexOf("flag") + 6
      );
      setFlag(f);
      if (response.status === 200) {
        setMeData(response.data.me);
        setFriendData(response.data.friend);
      }
    };

    fetch();
    return () => {
      if (socket.current) {
        socket.current.off("");
      }
    };
  }, []);

  const handleAcceptCall = () => {};

  return (
    <>
      {friendData && meData && flag ? (
        <div className="video-call">
          <div className="background-video"></div>
          <div className="your-video">
            <video playsInline muted ref={callerRef} autoPlay />
            {!flag && (
              <div>
                <button onClick={handleAcceptCall}>Chaasp nhaan</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loadding />
      )}
    </>
  );
}
