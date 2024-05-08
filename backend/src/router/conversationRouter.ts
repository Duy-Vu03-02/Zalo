import express, { Request, Response } from "express";
import {
  getAllConversationByUser,
  getOfCreateConversation,
  createConversation,
} from "../controllers/ConverationController";

export default (router: express.Router) => {
  router.post(
    "/conversation/getallconversationbyuser",
    getAllConversationByUser
  );
  router.post("/conversation/getofcreateconversation", getOfCreateConversation);
  router.post("/conversation/createconversation", createConversation);
};
