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
import { send } from "process";

export const getAllMessageByUser = async (req: Request, res: Response) => {
  try {
    const { idConversation } = req.body;
    const messgaes = await getAllMessagesByConversation(idConversation).select(
      "sender message"
    );
    if (messgaes) {
      res.status(200).json(messgaes);
    } else {
      res.sendStatus(204);
    }
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
        seen: false,
      });

      const conversation = await ConversationModel.findById(idConversation);
      if (conversation) {
        conversation.countMessseen = (
          parseInt(conversation.countMessseen) + 1
        ).toString();
        await conversation.save();
      }
    } else {
    }
  } catch (err) {
    console.error(err);
  }
};
