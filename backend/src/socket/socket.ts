import express from "express";
import fs from "fs";
import path from "path";
import { Socket } from "socket.io";
import { getUsersById } from "../config/schema/UserModel";
import {
  updateLastMessgae,
  updateCountSeenConversation,
  getAllIDConversationByUser,
  createConversation,
  handleGetUserByConversation,
  getConversationByFriendID,
} from "../controllers/ConverationController";
import { createMessagesByConversation } from "../controllers/MessageController";
import {
  KET_BAN,
  DONG_Y,
  BO_QUA,
  HUY_LOI_MOI_KET_BAN,
  BAN_BE,
  XOA_BAN_BE,
  ACTIVE,
  getUserById,
} from "../controllers/UserController";

import { getConversationById } from "../config/schema/ConversationModel";
import { reverse } from "lodash";
const app = express();
const server = require("https").createServer(
  {
    cert: fs.readFileSync(path.resolve(__dirname, "../../../.cert/cert.pem")),
    key: fs.readFileSync(path.resolve(__dirname, "../../../.cert/key.pem")),
  },
  app
);

const socket = require("socket.io");
const io = socket(server, {
  cors: {
    credentials: true,
    origin: "*",
  },
});

const listRoom = new Map();

io.on("connection", async (socket: Socket) => {
  // console.log("user connection: ", socket.id);

  socket.on("disconnect", async () => {
    const key = await handleStoreDate(new Date(), socket.id);
    listRoom.delete(key);
  });

  socket.on("add-user", async (data: any) => {
    listRoom.set(data.id, socket.id);
    await handleStoreDate(ACTIVE, socket.id);

    // socket friend onl-offfline
    // if (data.listFriend) {
    //   for (let id of data.listFriend) {
    //     socket.to(listRoom.get(id)).emit("state-friend-active", {
    //       idFriendActive: id,
    //       state: true,
    //       text: ACTIVE,
    //     });
    //   }
    // }
  });

  socket.on("send-mess", async (data: any) => {
    if (!data.idConversation) {
      const newConversation = await createConversation(
        data.idSend,
        data.idRecieve
      );
      if (newConversation) {
        const id = listRoom.get(data.idRecieve);
        const resData = {
          idConversation: newConversation._id,
          sender: data.idSend,
          message: data.mess,
          imgMess: data.imgMess ? data.imgMess : null,
        };
        await createMessagesByConversation(resData);
        const countMessseen = await updateCountSeenConversation({
          idConversation: newConversation._id,
          number: 1,
        });
        await updateLastMessgae(resData);
        const currentConversation: any = await handleGetUserByConversation(
          newConversation,
          data.idSend
        );
        if (currentConversation?.lastMessage) {
          currentConversation.lastMessage = data.mess
            ? data.mess
            : `Bạn đã gửi ${data.imgMess.length} ảnh`;
        }
        if (id) {
          const conversationFriend = await handleGetUserByConversation(
            newConversation,
            data.idRecieve
          );
          socket
            .to(id)
            .emit("received-soft-conversation", conversationFriend, () => {
              socket.to(id).emit("recieve-lastmess", {
                lastMessage: data.mess
                  ? data.mess
                  : `đã gửi ${data.imgMess?.length} ảnh`,
                lastSend: data.idSend,
                idConversation: newConversation._id,
              });

              socket.to(id).emit("recieve-mess", {
                sender: data.idSend,
                message: data.mess,
                updatedAt: newConversation.updatedAt,
                idConversation: newConversation._id,
                imgMess: data.imgMess,
              });

              if (countMessseen) {
                socket.to(id).emit("recieve-count-seen", {
                  countMessseen: countMessseen,
                  idConversation: newConversation._id,
                });
              }
            });
        }
        socket.emit("received-soft-contact-conversation", currentConversation);
        socket.emit("recieve-lastmess", {
          idConversation: newConversation._id,
          lastMessage: data.mess
            ? data.mess
            : data.imgMess && data.imgMess.length > 0
            ? `đã gửi ${data.imgMess?.length} ảnh`
            : null,
          lastSend: data.idSend,
        });
      }
    } else {
      const id = listRoom.get(data.idRecieve);
      const resData = {
        idConversation: data.idConversation,
        sender: data.idSend,
        message: data.mess,
        imgMess: data.imgMess ? data.imgMess : null,
      };
      await createMessagesByConversation(resData);
      const countMessseen = await updateCountSeenConversation({
        idConversation: data.idConversation,
        number: 1,
      });
      await updateLastMessgae(resData);

      if (id) {
        socket.to(id).emit("recieve-lastmess", {
          lastMessage: data.mess
            ? data.mess
            : `đã gửi ${data.imgMess?.length} ảnh`,
          lastSend: data.idSend,
          idConversation: data.idConversation,
        });

        socket.to(id).emit("recieve-mess", {
          sender: data.idSend,
          message: data.mess,
          updatedAt: data.updatedAt,
          imgMess: data.imgMess,
          idConversation: data.idConversation,
        });

        if (countMessseen) {
          socket.to(id).emit("recieve-count-seen", {
            countMessseen: countMessseen,
            idConversation: data.idConversation,
          });
        }
      }
    }
  });

  //
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
          cancel: BO_QUA,
          id: data.userId,
        });
      }
    }

    if (data.state === DONG_Y) {
      socket.emit("recieve-crud-fr", {
        mess: BAN_BE,
        unfriend: XOA_BAN_BE,
        id: data.friendId,
        refreshCoversation: true,
      });
      if (idRecieve) {
        socket.to(idRecieve).emit("recieve-crud-fr", {
          mess: BAN_BE,
          unfriend: XOA_BAN_BE,
          id: data.userId,
          refreshCoversation: true,
        });
      }
    }

    if (data.state === BO_QUA) {
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
      socket.emit("recieve-crud-fr", {
        mess: KET_BAN,
        id: data.friendId,
      });
      if (idRecieve) {
        socket.to(idRecieve).emit("recieve-crud-fr", {
          mess: KET_BAN,
          id: data.userId,
        });
      }
    }
  });

  socket.on("seen-mess", async (data) => {
    try {
      const countMessseen = await updateCountSeenConversation({
        number: -1,
        idConversation: data.idConversation,
        idSeend: data.idSeend,
      });

      if (countMessseen) {
        const idChatWith = listRoom.get(data.idChatWith);
        if (idChatWith) {
          socket.emit("recieve-count-seen", {
            countMessseen: countMessseen,
            idConversation: data.idConversation,
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("create-new-conversation", async (data) => {
    const resultConversation = await createConversation(
      data.userId,
      data.friendId
    );
    socket.emit(
      "received-new-conversation",
      await handleGetUserByConversation(resultConversation, data.userId)
    );
  });

  socket.on("create-soft-conversation", async (data) => {
    const user = await getUserById(data.friendId);
    if (user) {
      socket.emit("received-soft-mess", user);
    }
  });

  /// socket - video call
  socket.emit("me", socket.id);
  socket.on("call-user", (data) => {
    const userCaller = listRoom.get(data.userCaller);
    const userReceiver = listRoom.get(data.userReceiver);

    if (userCaller && userReceiver) {
      io.to(userReceiver).emit("join-room-call", {
        userCallId: data.socket_id,
        url: `https://localhost:3000/videocall?&flag=0&id=${data.userCaller}`,
      });
    }
  });

  socket.on("do-not-accept-call", (data) => {
    console.log(data.userCallerId);
    io.to(data.userCallerId).emit("not-accept-call", {});
  });
});

const handleStoreDate = async (value: any, id: any) => {
  listRoom.forEach(async (item, key) => {
    if (item == id) {
      const user = await getUsersById(key);
      if (user) {
        user.lastActive = value;
        user.save();
      }
      return key;
    }
  });
};

export { server, app };
