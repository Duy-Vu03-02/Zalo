import express, { Request, Response } from "express";
import { getAllMessageByUser } from "../controllers/MessageController";

export default (router: express.Router) => {
  router.post("/message/getallmessage", getAllMessageByUser);
  router.post("/message/createmessage");
};
