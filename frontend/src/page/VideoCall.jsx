import React, {
  useContext,
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
} from "react";
import Peer from "simple-peer";
import { UserContext } from "../Context/UserContext";
import { getFriendById } from "../util/api";

export default function VideoCall() {
  const { userData, socket } = useContext(UserContext);
  const url = window.location.href;
  const base = decodeURIComponent(url.split("?")[1]).split("&");
  const caller = base[0];
  const receiver = base[1];
  const [friendData, setFriendData] = useState(null);
  const [stream, setStream] = useState("");
  const callerRef = useRef(null);
  const receiverRef = useRef(null);
  const connectionRef = useRef(null);

  useLayoutEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setStream(stream);
        callerRef.current.srcObject = stream;
      });

    const fetch = async () => {
      const response = await getFriendById({
        friendId: receiver.replace("receiver=", ""),
      });
      if (response.status === 200) {
        setFriendData(response.data);
        if (socket.current && caller === userData._id) {
          const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });

          peer.on("signal", (data) => {
            socket.current.emit("call-user", {
              userCaller: caller,
              userReceiver: receiver,
              signal: data,
            });
          });

          peer.on("stream", (stream) => {
            receiverRef.current.srcObject = stream;
          });

          socket.on("call-accepted", (data) => {
            peer.signal(data.signal);
          });
          connectionRef.current = peer;
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
  console.log(userData);
  console.log(socket);
  return (
    <>
      <div>
        <video playsInline muted ref={callerRef} autoPlay />
        {userData && caller !== userData._id && (
          <div>
            <button onClick={handleAcceptCall}>Chaasp nhaan</button>
          </div>
        )}
      </div>
    </>
  );
}
