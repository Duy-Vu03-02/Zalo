import express, { Request, Response } from "express";
import {
  getAllMessages,
  createMessage,
} from "../controllers/messageController";

export default (router: express.Router) => {
  router.post("/message/getallmessage", getAllMessages);
  router.post("/message/createmessage", createMessage);
  router.post("/ak", (req: Request, res: Response) => {
    console.log(req.body);
  });
};
