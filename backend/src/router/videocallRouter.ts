import { callUser } from "../controllers/VideoCallController";
import express, { Request, Response, Router } from "express";

export default (router: express.Router) => {
  router.post("/call/videocall", callUser);
};
