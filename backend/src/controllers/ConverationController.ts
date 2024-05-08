import express, { Request, Response } from "express";
import { UserModel, getUsersById } from "../config/schema/UserModel";
import { ConversationModel } from "../config/schema/ConversationModel";
import { MessagesModel } from "../config/schema/MessageModel";
import { forEach, last, now } from "lodash";
import { ACTIVE, calculatorLastActive } from "./UserController";

export const createConversation = async (userId: any, friendId: any) => {
  try {
    const check = await ConversationModel.findOne({
      member: { $all: [userId, friendId] },
    });
    if (!check) {
      const newConversation = new ConversationModel({
        type: "single",
        lastMessage: "",
        member: [userId, friendId],
      });
      await newConversation.save();
      return;
    } else {
      return;
    }
  } catch (err) {
    console.error(err);
  }
};

export const getAllConversationByUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const allConnversation = await ConversationModel.find({
      member: { $in: [id] },
    });
    if (allConnversation && allConnversation.length > 0) {
      const sortConversation = allConnversation.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      handleGetUserConversation(sortConversation, id)
        .then((result) => {
          return res.status(200).json(result);
        })
        .catch((err) => {
          console.error(err);
          return res.sendStatus(204);
        });
    } else {
      return res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

const handleGetUserConversation = async (sortConversation: any, id: String) => {
  let listMember: any[] = [];
  for (let item of sortConversation) {
    const resData: any = {
      idConversation: item.id,
      lastMessage: item.lastMessage,
      updatedAt: item.updatedAt,
      username: "",
      avatar: "",
      idChatWith: "",
      lastActive: "",
    };
    for (let x of item.member) {
      if (x != id) {
        const user = await getUsersById(x).select("avatar lastActive");
        if (user) {
          resData.username = user.username;
          resData.avatar = user.avatar;
          resData.idChatWith = user._id;
          resData.lastActive = await calculatorLastActive(user.lastActive);
          listMember.push(resData);
        }
      }
    }
  }
  return Promise.all(listMember);
};

export const getOfCreateConversation = async (req: Request, res: Response) => {
  const { userId, friendId } = req.body;
  const conversation = await ConversationModel.findOne({
    member: { $all: [userId, friendId] },
  });

  if (conversation) {
    return res.status(200).json(conversation);
  } else {
    return createConversation(userId, friendId);
  }
};
