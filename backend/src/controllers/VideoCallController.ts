import express, { Request, Response } from "express";
import { verifyToken } from "../helper/helper";
import { UserModel } from "../config/schema/UserModel";
import { friendByName } from "./UserController";

export const callUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token || null;
    const { friendId } = req.body;

    if (token && token.trim() !== "" && friendId) {
      const verify = await verifyToken(token);

      if (verify === true) {
        const payloadBase64 = token.split(".")[1];
        const payload = atob(payloadBase64);
        const { _id, phone } = await JSON.parse(payload);
        if (_id && phone) {
          const user = await UserModel.findById(_id).select(
            "phone avatar friend"
          );
          if (user && user.phone === phone && user.friend.includes(friendId)) {
            const friend = await UserModel.findById(friendId).select(
              "username avatar"
            );
            if (friend) {
              return res.status(200).json({ friend: friend, me: user });
            }
          }
        }
      }
    }

    return res.sendStatus(403);
  } catch (err) {
    console.error(err);
    return res.sendStatus(404);
  }
};
