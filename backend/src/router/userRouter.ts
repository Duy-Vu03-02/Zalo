import express, { Request, Response, Router } from "express";
import {
  crudfriend,
  getAllFriend,
  updateUser,
  friendByName,
  userByPhone,
  loginByAccount,
  loginBySessiToken,
  register,
  updateAvatar,
} from "../controllers/UserController";

export default (router: express.Router) => {
  router.post("/user/getallfriend", getAllFriend);
  router.post("/user/crudfriend", crudfriend);
  router.post("/user/getphone", userByPhone);
  router.post("/user/getfriendbyname", friendByName);
  router.post("/user/updateavatarbyid", updateAvatar);
  router.post("/auth/register", register);
  router.post("/auth/login", loginByAccount);
  router.post("/auth/sessiontoken", loginBySessiToken);
};
