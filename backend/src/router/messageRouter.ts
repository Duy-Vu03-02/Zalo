import express from "express";
import {
  getAllMessages,
  createMessage,
} from "../controllers/messageController";

export default (router: express.Router) => {
  router.post("/message/getallmessage", getAllMessages);
  router.post("/message/createmessage", createMessage);
};
