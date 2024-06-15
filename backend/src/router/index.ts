import express from "express";

import user from "./UserRouter";
import message from "./MessageRouter";
import group from "./GroupRouter";
import conversationRouter from "./ConversationRouter";
import videocallRouter from "./videocallRouter";

const router = express.Router();

export default (): express.Router => {
  user(router);
  message(router);
  conversationRouter(router);
  group(router);
  videocallRouter(router);
  return router;
};
