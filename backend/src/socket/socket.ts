import express from "express";
import { Socket } from "socket.io";
import { getUsersById } from "../config/schema/UserModel";
import {
  updateLastMessgae,
  updateCountSeenConversation,
  getAllIDConversationByUser,
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
    const id = listRoom.get(data.idRecieve);
    const resData = {
      idConversation: data.idConversation,
      sender: data.idSend,
      message: data.mess,
    };
    await createMessagesByConversation(resData);
    const countMessseen = await updateCountSeenConversation({
      idConversation: data.idConversation,
      number: 1,
    });
    await updateLastMessgae(resData);

    if (id) {
      socket.to(id).emit("recieve-lastmess", {
        lastMessage: data.mess,
        lastSend: data.idSend,
        idConversation: data.idConversation,
      });

      socket.to(id).emit("recieve-mess", {
        sender: data.idSend,
        message: data.mess,
      });

      if (countMessseen) {
        socket.to(id).emit("recieve-count-seen", {
          countMessseen: countMessseen,
          idConversation: data.idConversation,
        });
      }
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
