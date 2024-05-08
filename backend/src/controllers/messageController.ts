import express, { Request, Response } from "express";
import { UserModel, getUsersById } from "../config/schema/UserModel";
import { ConversationModel } from "../config/schema/ConversationModel";
import {
  MessagesModel,
  createMessages,
  getAllMessagesByConversation,
} from "../config/schema/MessageModel";
import { forEach, last, now } from "lodash";
import { ACTIVE, calculatorLastActive } from "./UserController";

export const getAllMessageByUser = async (req: Request, res: Response) => {
  try {
    const { idConversation } = req.body;
    const messgaes = await getAllMessagesByConversation(idConversation);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

export const createMessagesByConversation = async (data: any) => {
  try {
    const { idConversation, sender, message } = data;
    const conversation = await ConversationModel.findById(idConversation);
    if (conversation) {
      const newMess = await createMessages({
        idConversation,
        sender,
        message,
      });
    } else {
    }
  } catch (err) {
    console.error(err);
  }
};
