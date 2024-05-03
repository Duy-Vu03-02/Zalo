import express, { Request, Response } from "express";
import {
  createGrroup,
  newMessGr,
  getAllGroup,
} from "../controllers/groupController";

export default (router: express.Router) => {
  router.post("/group/creategroup", createGrroup);
  router.post("/group/createmessagegroup", newMessGr);
  router.post("/group/getallgroup", getAllGroup);
};
