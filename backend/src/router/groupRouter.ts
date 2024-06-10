import express, { Request, Response } from "express";
import { createGroupConversation } from "../controllers/ConverationController";
export default (router: express.Router) => {
  router.post("/group/creategroup", createGroupConversation);
  //   router.post("/group/createmessagegroup", newMessGr);
  //   router.post("/group/getallgroup", getAllGroup);
};
