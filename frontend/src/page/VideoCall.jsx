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
import { SlCallEnd } from "react-icons/sl";
import { IoVideocamOffOutline } from "react-icons/io5";
import { IoVideocamOutline } from "react-icons/io5";
import { IoMicOffOutline } from "react-icons/io5";
import { IoMicOutline } from "react-icons/io5";
import "../resource/style/VideoCall/videocall.css";

export default function VideoCall() {
  const [friendData, setFriendData] = useState(null);
  const [meData, setMeData] = useState("");
  const [flag, setFlag] = useState("");
  const [stream, setStream] = useState("");
  const [acceptCall, setacceptCall] = useState(false);
  const callerRef = useRef(null);
  const receiverRef = useRef(null);
  const connectionRef = useRef(null);
  const socket = useRef(null);
  socket.current = io("https://192.168.41.26");
  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);

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

        if (flag) {
          const peer = new Peer({
            initiation: true,
            trickle: false,
            stream: stream,
          });

          peer.on("signal", (data) => {
            socket.current.emit("call-user", {
              userCaller: meData._id,
              userReceiver: friendData._id,
              signal: data,
            });
          });

          peer.on("stream", (stream) => {
            receiverRef.current.srcObject = stream;
          });
        }
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
          <div className="background-video">
            {acceptCall ? (
              ""
            ) : (
              <div className="not-accept">
                <img src={friendData.avatar} alt="" />
                <p>{friendData.username}</p>
                <p
                  style={{
                    fontSize: "12px",
                    textTransform: "lowercase",
                    height: "120px",
                  }}
                >
                  đang gọi . . .
                </p>
              </div>
            )}
          </div>
          <div className="menu-call flex">
            <div onClick={() => setMic(!mic)}>
              {mic ? <IoMicOutline /> : <IoMicOffOutline />}
            </div>
            <div onClick={() => setVideo(!video)}>
              {video ? <IoVideocamOutline /> : <IoVideocamOffOutline />}
            </div>
            <div>
              <SlCallEnd className="icon-call" />
            </div>
          </div>
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