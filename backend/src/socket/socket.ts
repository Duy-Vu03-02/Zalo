import express from "express";
import { Socket } from "socket.io";
import {
  KET_BAN,
  DONG_Y,
  HUY,
  HUY_LOI_MOI_KET_BAN,
  BAN_BE,
  XOA_BAN_BE,
} from "../controllers/UserController";
const app = express();
const server = require("http").createServer(app);

const socket = require("socket.io");
const io = socket(server, {
  cors: {
    Credential: true,
    // origin: "http://localhost:3000",
    origin: "*",
  },
});

const listRoom = new Map();

io.on("connection", (socket: Socket) => {
  // console.log("user connection: ", socket.id);

  socket.on("disconnect", () => {
    listRoom.forEach((item: String, key: String) => {
      if (key === socket.id) {
        listRoom.delete(item);
      }
    });
  });

  socket.on("add-user", (data: any) => {
    listRoom.set(data.id, socket.id);
  });

  socket.on("send-mess", (data: any) => {
    const id = listRoom.get(data.idRecieve);
    if (id) {
      socket.to(id).emit("recieve-mess", { send: false, message: data.mess });
    }
  });

  socket.on("crud-friend", (data: any) => {
    const idSend = listRoom.get(data.userId);
    const idRecieve = listRoom.get(data.friendId);

    if (data.state === KET_BAN) {
      socket.emit("recieve-crud-fr", {
        mess: HUY_LOI_MOI_KET_BAN,
        id: data.friendId,
      });
      if (idRecieve) {
        socket.to(idRecieve).emit("recieve-crud-fr", {
          mess: DONG_Y,
          cancel: HUY,
          id: data.userId,
        });
      }
    }

    if (data.state === DONG_Y) {
      socket.emit("recieve-crud-fr", {
        mess: BAN_BE,
        unfriend: XOA_BAN_BE,
        id: data.friendId,
      });
      if (idRecieve) {
        socket.to(idRecieve).emit("recieve-crud-fr", {
          mess: BAN_BE,
          unfriend: XOA_BAN_BE,
          id: idSend,
        });
      }
    }

    if (data.state === HUY) {
      socket.emit("recieve-crud-fr", { mess: KET_BAN, id: data.friendId });
      if (idRecieve) {
        socket
          .to(idRecieve)
          .emit("recieve-crud-fr", { mess: KET_BAN, id: data.userId });
      }
    }

    if (data.state === HUY_LOI_MOI_KET_BAN) {
      socket.emit("recieve-crud-fr", { mess: KET_BAN, id: data.friendId });
      if (idRecieve) {
        socket
          .to(idRecieve)
          .emit("recieve-crud-fr", { mess: KET_BAN, id: data.userId });
      }
    }

    if (data.state === XOA_BAN_BE) {
      socket.emit("recieve-crud-fr", { mess: KET_BAN, id: data.friendId });
      if (idRecieve) {
        socket
          .to(idRecieve)
          .emit("recieve-crud-fr", { mess: KET_BAN, id: data.userId });
      }
    }
  });
});

export { server, app };

// const io = require('socket.io')(server);

// // Đối tượng lưu trữ thông tin về phòng của mỗi người dùng
// const userRooms = {};

// io.on('connection', (socket) => {
//   socket.on('create-room', () => {
//     const roomId = generateRoomId(); // Tạo ID phòng mới
//     socket.join(roomId); // Người dùng tham gia vào phòng
//     userRooms[socket.id] = roomId; // Lưu thông tin phòng của người dùng
//     socket.emit('room-created', roomId); // Gửi ID phòng đến người dùng
//   });

//   socket.on('join-room', (roomIdToJoin) => {
//     socket.join(roomIdToJoin); // Người dùng tham gia vào phòng
//     userRooms[socket.id] = roomIdToJoin; // Lưu thông tin phòng của người dùng
//     socket.emit('room-joined', roomIdToJoin); // Gửi ID phòng đến người dùng
//   });

//   socket.on('disconnect', () => {
//     const roomId = userRooms[socket.id];
//     if (roomId) {
//       io.to(roomId).emit('user-left', socket.id); // Gửi thông báo cho tất cả các người dùng trong phòng rằng một người dùng đã rời phòng
//       delete userRooms[socket.id]; // Xóa thông tin phòng của người dùng khi họ rời khỏi phòng
//     }
//   });

//   socket.on('send-message', (message) => {
//     const roomId = userRooms[socket.id];
//     if (roomId) {
//       io.to(roomId).emit('receive-message', { senderId: socket.id, message });
//     }
//   });
// });
