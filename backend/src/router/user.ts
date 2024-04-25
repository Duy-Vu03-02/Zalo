import express, { Request, Response, Router } from "express";
import {
  getAllUsers,
  updateUser,
  userByPhone,
  loginByAccount,
  loginBySessiToken,
  register,
} from "../controllers/user";

export default (router: express.Router) => {
  router.post("/user/getfriend", getAllUsers);
  router.post("/user/getphone", userByPhone);
  router.post("/auth/register", register);
  router.post("/auth/login", loginByAccount);
  router.post("/auth/sessiontoken", loginBySessiToken);
};
