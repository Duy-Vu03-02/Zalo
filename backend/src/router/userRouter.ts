import express, { Request, Response, Router } from "express";
import {
  crudfriend,
  getAllFriend,
  updateUser,
  friendByName,
  userByPhone,
  loginByAccount,
  loginByToken,
  register,
  updateAvatar,
  getAllGroup,
  getFriendReq,
  getGroupReq,
  getFriendRes,
} from "../controllers/UserController";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", loginByAccount);
  router.post("/auth/token", loginByToken);
  router.post("/user/getallgroup", getAllGroup);
  router.post("/user/getfriendreq", getFriendReq);
  router.post("/user/getfriendres", getFriendRes);
  router.post("/user/getgroupreq", getGroupReq);
  router.post("/user/getallfriend", getAllFriend);
  router.post("/user/crudfriend", crudfriend);
  router.post("/user/getphone", userByPhone);
  router.post("/user/getfriendbyname", friendByName);
  router.post("/user/updateavatarbyid", updateAvatar);
};
