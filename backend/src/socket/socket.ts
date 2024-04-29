import express from "express";
import { Socket } from "socket.io";
const app = express();
const server = require("http").createServer(app);

const socket = require("socket.io");
const io = socket(server, {
  cors: {
    Credential: true,
    origin: "http://localhost:3000",
  },
});

let listRoom = [String];

io.on("connection", (socket: Socket) => {
  console.log("user connection");
  socket.on("disconnect", () => {
    console.log("User disconnect");
  });

  socket.on("create-room", (data) => {
    const roomID = data.idSend;
    const idSend = data.idSend;
    const idRecieve = data.idRecieve;
    socket.join(idSend);
    socket.join(idRecieve);
    listRoom.push(roomID);
    io.to(roomID).emit(roomID);
    console.log(listRoom);
  });

  socket.on("chat message", (data) => {
    console.log(data);
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
