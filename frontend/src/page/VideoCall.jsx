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
  const [signalData, setSignalData] = useState(null);
  const callerRef = useRef(null);
  const receiverRef = useRef(null);
  const connectionRef = useRef(null);
  const socket = useRef(null);
  socket.current = io("https://localhost");

  const [mic, setMic] = useState(true);
  const [video, setVideo] = useState(true);
  const [stateCall, setStateCall] = useState("");

  useEffect(() => {
    let idSocket = "";
    if (socket.current) {
      socket.current.on("me", (data) => (idSocket = data));
    }

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
        const resData = response.data;
        setMeData(resData.me);
        setFriendData(resData.friend);

        if (f && socket.current && idSocket) {
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });

          peer.on("signal", (data) => {
            socket.current.emit("call-user", {
              userCaller: resData.me._id,
              userReceiver: resData.friend._id,
              signal: data,
              socket_id: idSocket,
            });
          });

          peer.on("stream", (stream) => {
            receiverRef.current.srcObject = stream;
          });
        }
      }
    };

    if (socket.current) {
      socket.current.on("accept-call", (data) => {
        setSignalData(data);
      });

      // Do not accept call
      socket.current.on("not-accept-call", () => {
        console.log("ceheck");
        setStateCall("Người nhận đang bận");
      });
    }

    fetch();
    // return () => {
    //   if (socket.current) {
    //     socket.current.off("accept-call");
    //   }
    // };
  }, []);

  useEffect(() => {
    if (stateCall !== null && stateCall.trim() !== "") {
      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }, [stateCall]);

  const handleAcceptCall = () => {
    const peer = new Peer({
      initiation: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("answer-call", {
        signal: data,
      });
    });

    peer.on("stream", (data) => {
      setacceptCall(true);
      receiverRef.current.srcObject = data;
    });

    peer.signal(signalData);
    connectionRef.current = peer;
  };

  return (
    <>
      {friendData && meData && flag ? (
        <div className="video-call">
          <div className="background-video">
            {acceptCall ? (
              <div className="receiver-video">
                <video ref={receiverRef}></video>
              </div>
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
                  {stateCall ? stateCall : "đang gọi . . ."}
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
