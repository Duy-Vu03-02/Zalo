import express, { Request, Response } from "express";
import {
  getConversationByUser,
  getOfCreateConversation,
  createConversation,
} from "../controllers/MessageController";

export default (router: express.Router) => {
  router.post("/message/getallmessage", getConversationByUser);
  router.post("/message/createmessage", getOfCreateConversation);
};
