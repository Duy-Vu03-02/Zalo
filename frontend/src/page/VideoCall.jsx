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
import { IoFlash, IoVideocamOffOutline } from "react-icons/io5";
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

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     socket.current.emit("end-video-call", { person: friendData._id });
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setStream(stream);
        callerRef.current.srcObject = stream;
      });
    let f;
    const fetch = async () => {
      const baseUrl = window.location.href;
      const friendId = baseUrl.split("id=")[1];
      const response = await callUser({ receiver: friendId });
      f = baseUrl.slice(
        baseUrl.indexOf("flag") + 5,
        baseUrl.indexOf("flag") + 6
      );
      setFlag(f == 1 ? true : false);
      if (response.status === 200) {
        const resData = response.data;
        setMeData(resData.me);
        setFriendData(resData.friend);

        if (f == 1 && socket.current) {
          // call user
          socket.current.emit("call-user", {
            userCaller: resData.me._id,
            userReceiver: resData.friend._id,
          });
        }

        if (f == 0 && socket.current) {
          //
          socket.current.emit("done-join-call", {
            userReceiver: resData.me._id,
            userCaller: resData.friend._id,
          });
        }
      }
    };

    fetch();
  }, []);

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on("not-accept-call", () => {
  //       setStateCall("Người nhận đang bận");
  //     });
  //     socket.current.on("end-metting", () => {
  //       setStateCall("Kết thúc cuộc gọi");
  //     });
  //   }
  //   if (socket.current && flag) {
  //     socket.current.on("send-signal", () => {
  //       if (flag && socket.current && friendData) {
  //         const peer = new Peer({
  //           initiator: true,
  //           trickle: false,
  //           stream,
  //         });

  //         peer.on("signal", (data) => {
  //           socket.current.emit("give-signal", {
  //             signal: data,
  //             receiver: friendData._id,
  //           });
  //         });

  //         peer.on("stream", (stream) => {
  //           receiverRef.current.srcObject = stream;
  //         });
  //         socket.current.on("accept-call", (data) => {
  //           peer.signal = data.signal;
  //         });
  //         setacceptCall(true);

  //         connectionRef.current = peer;
  //       }
  //     });
  //   }
  //   if (socket.current && !flag && friendData) {
  //     const peer = new Peer({
  //       initiation: false,
  //       trickle: false,
  //       stream,
  //     });

  //     peer.on("signal", (data) => {
  //       socket.current.emit("answer-call", {
  //         userCaller: friendData._id,
  //         signal: data,
  //       });
  //     });

  //     peer.on("stream", (data) => {
  //       receiverRef.current.srcObject = data;
  //     });

  //     socket.current.on("received-signal", (data) => {
  //       peer.signal(data);
  //       setacceptCall(true);
  //     });
  //     connectionRef.current = peer;
  //   }

  //   return () => {
  //     if (socket.current) {
  //       socket.current.off("not-accept-call");
  //       socket.current.off("send-signal");
  //       socket.current.off("accept-call");
  //       socket.current.off("received-signal");
  //     }
  //   };
  // }, [socket.current]);

  // const callUserVideo = () => {
  //   socket.current.on("send-signal", () => {
  //     if (flag && socket.current && friendData) {
  //       const peer = new Peer({
  //         initiator: true,
  //         trickle: false,
  //         stream,
  //       });

  //       peer.on("signal", (data) => {
  //         socket.current.emit("give-signal", {
  //           signal: data,
  //           receiver: friendData._id,
  //         });
  //       });

  //       peer.on("stream", (stream) => {
  //         receiverRef.current.srcObject = stream;
  //       });
  //       socket.current.on("accept-call", (data) => {
  //         console.log(data);
  //         peer.signal =data.signal;
  //       });
  //       setacceptCall(true);

  //       connectionRef.current = peer;
  //     }
  //   });
  // };

  // const answerCallVideo = () => {
  //   const peer = new Peer({
  //     initiation: false,
  //     trickle: false,
  //     stream,
  //   });

  //   peer.on("signal", (data) => {
  //     socket.current.emit("answer-call", {
  //       userCaller: resData.friend._id,
  //       signal: data,
  //     });
  //   });

  //   peer.on("stream", (data) => {
  //     receiverRef.current.srcObject = data;
  //   });

  //   socket.current.on("received-signal", (data) => {
  //     peer.signal(data);
  //     connectionRef.current = peer;
  //   });
  // };

  useEffect(() => {
    if (stateCall !== null && stateCall.trim() !== "") {
      setTimeout(() => {
        window.close();
      }, 3000);
    }
  }, [stateCall]);

  const handleCancelCall = () => {
    if (socket.current) {
      socket.current.emit("end-video-call", { person: friendData._id });
    }
  };

  return (
    <>
      {friendData && meData ? (
        <div className="video-call">
          <div className="background-video">
            {acceptCall ? (
              <div className="receiver-video">
                <video playsInline muted autoPlay ref={receiverRef}></video>
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
                  {stateCall
                    ? stateCall
                    : flag
                    ? "đang gọi . . . "
                    : "đang kết nối . . ."}
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
              <SlCallEnd className="icon-call" onClick={handleCancelCall} />
            </div>
          </div>
          <div className="your-video">
            <video playsInline muted ref={callerRef} autoPlay />
          </div>
        </div>
      ) : (
        <Loadding />
      )}
    </>
  );
}
