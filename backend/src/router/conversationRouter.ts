import express, { Request, Response } from "express";
import {
  getAllConversationByUser,
  getOfCreateConversation,
  createConversation,
  getConversationByFriendID,
  delConversationById,
} from "../controllers/ConverationController";

export default (router: express.Router) => {
  router.post(
    "/conversation/getallconversationbyuser",
    getAllConversationByUser
  );
  router.post(
    "/conversation/getconversationbyfriendid",
    getConversationByFriendID
  );
  router.post("/conversation/getofcreateconversation", getOfCreateConversation);
  router.post("/conversation/createconversation", createConversation);
  router.post("/conversation/delconversation", delConversationById);
};
