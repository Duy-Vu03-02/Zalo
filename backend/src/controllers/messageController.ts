import express, { Request, Response } from "express";
import { genderJWT } from "helper/helper";
import { getMessages, createMessages } from "../config/schema/messageModel";
import { send } from "process";
import { get } from "lodash";

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;
    const allMessages = await getMessages(from, to);
    console.log(allMessages);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Failed to retrieve messages" });
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
