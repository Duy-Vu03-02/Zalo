import express, { Request, Response } from "express";
import { genderJWT } from "helper/helper";
import { getMessages, createMessages } from "../config/schema/messageModel";
import { send } from "process";

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    const mess = await getMessages(from, to);
    if (mess == null) {
      return res.sendStatus(204);
    } else {
      return res.status(200).json(mess);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { message, user, sender } = req.body;
    const newMess = await createMessages({
      message: message,
      user: {
        from: user.from,
        to: user.to,
      },
      sender: sender,
    });
    return res.status(200).json(newMess).end();
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};
