import express, { Request, Response, Router } from "express";
import {
  getAllUsers,
  updateUser,
  userByName,
  userByPhone,
  loginByAccount,
  loginBySessiToken,
  register,
} from "../controllers/userController";

export default (router: express.Router) => {
  router.post("/user/getallfriend", getAllUsers);
  router.post("/user/getphone", userByPhone);
  router.post("/user/getfriend", userByName);
  router.post("/auth/register", register);
  router.post("/auth/login", loginByAccount);
  router.post("/auth/sessiontoken", loginBySessiToken);
};
