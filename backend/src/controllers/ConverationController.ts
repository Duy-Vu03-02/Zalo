import express, { Request, Response } from "express";
import { UserModel, getUsersById } from "../config/schema/UserModel";
import { ConversationModel } from "../config/schema/ConversationModel";
import { MessagesModel } from "../config/schema/MessageModel";
import { forEach, last, now } from "lodash";
import { ACTIVE, calculatorLastActive } from "./UserController";
import { Model } from "mongoose";

export const TYPE_SINGLE = "single";
export const TYPE_GROUP = "group";

export const createConversation = async (
  userId: any,
  friendId: any
  // softConversation: Boolean = true
) => {
  try {
    const check = await ConversationModel.findOne({
      member: { $all: [userId, friendId] },
    });
    if (!check) {
      const newConversation = new ConversationModel({
        type: TYPE_SINGLE,
        lastMessage: "",
        member: [userId, friendId],
        countMesssenn: 0,
        lastSend: userId,
      });
      await newConversation.save();
      return newConversation;
    } else {
      return check;
    }
  } catch (err) {
    console.error(err);
  }
};

export const setSoftConversation = async (
  idConversation: String,
  state: Boolean
) => {
  try {
    const conversation = await ConversationModel.findByIdAndUpdate(
      idConversation,
      { softConversation: state },
      { new: true }
    );
    return conversation;
  } catch (err) {
    console.error(err);
  }
};

export const createGroupConversation = async (req: Request, res: Response) => {
  try {
    const { listMember, groupName, avatarGroup } = req.body;
    const newConversation = new ConversationModel({
      type: TYPE_GROUP,
      lastMessage: `Gửi lời chào đến group ${groupName}`,
      member: listMember,
      groupName: groupName,
      avatarGroup: avatarGroup,
      countMesssenn: 0,
    });
    await newConversation.save();
    res.status(200).json(newConversation);
  } catch (err) {
    console.error(err);
  }
};

export const getAllIDConversationByUser = async (id: String) => {
  try {
    const allConnversation = await ConversationModel.find({
      $and: [{ member: { $in: [id] } }, { type: TYPE_SINGLE }],
    }).select("_id");
  } catch (err) {
    console.error(err);
  }
};

export const getConversationByFriendID = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, friendId } = req.body;
    const conversation = await ConversationModel.findOne({
      member: { $all: [userId, friendId] },
    });
    if (conversation) {
      const newConversation: any = {
        idConversation: conversation._id,
        countMessseen: conversation.countMessseen,
        type: conversation.type,
        idChatWith: friendId,
        lastMessage: conversation.lastMessage,
        lastSend: conversation.lastSend,
      };
      res.status(200).json(newConversation);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

export const getAllConversationByUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const allConnversation = await ConversationModel.find({
      $and: [{ member: { $in: [id] } }, { type: TYPE_SINGLE }],
    });
    const allGroupConversation = await ConversationModel.find({
      $and: [{ member: { $in: [id] } }, { type: TYPE_GROUP }],
    });

    // coomit phan group
    // const convertGroupConversation = await handleConvertGroupConversation(
    //   allGroupConversation
    // );
    if (allConnversation && allConnversation.length > 0) {
      handleGetUserConversation(allConnversation, id)
        .then((result) => {
          // coomit phan group
          // const newReuslt = [...convertGroupConversation, ...result];

          const sortConversation = result.sort(
            (a: any, b: any) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          return res.status(200).json(sortConversation);
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

const handleConvertGroupConversation = async (data: any[]) => {
  const list = [];
  for (let item of data) {
    const temp = {
      type: item.type,
      idConversation: item.id,
      lastMessage: item.lastMessage,
      updatedAt: item.updatedAt,
      lastSend: item.lastSend,
      groupName: item.groupName,
      avatarGroup: item.avatarGroup,
      member: item.member,
      idChatWith: item.id,
      lastActive: await calculatorLastActive(item.lastActive),
      countMessseen: item.countMessseen,
    };
    list.push(temp);
  }
  return Promise.all(list);
};

export const handleGetUserByConversation = async (item: any, id: String) => {
  const resData: any = {
    type: item.type,
    idConversation: item.id,
    lastMessage: item.lastMessage,
    updatedAt: item.updatedAt,
    lastSend: item.lastSend,
    countMessseen: item.countMessseen,
    username: "",
    avatar: "",
    idChatWith: "",
    lastActive: "",
  };
  for (let x of item.member) {
    if (x !== id) {
      const user = await getUsersById(x).select("avatar lastActive");
      if (user) {
        resData.username = user.username;
        resData.avatar = user.avatar;
        resData.idChatWith = user._id;
        resData.lastActive = await calculatorLastActive(user.lastActive);
        return resData;
      }
    }
  }
};

const handleGetUserConversation = async (sortConversation: any, id: String) => {
  let listMember: any[] = [];
  for (let item of sortConversation) {
    listMember.push(await handleGetUserByConversation(item, id));
  }
  return Promise.all(listMember);
};

export const updateCountSeenConversation = async (data: any) => {
  try {
    const { idConversation, number, idSeend } = data;
    const conversation = await ConversationModel.findById(idConversation);

    if (conversation) {
      if (number == -1) {
        if (idSeend !== conversation.lastSend) {
          conversation.countMessseen = "0";
        }
      } else {
        conversation.countMessseen = (
          parseInt(conversation.countMessseen) + number
        ).toString();
      }
    }

    const newConversation = Object.assign({}, conversation);
    delete newConversation._id;
    await ConversationModel.findByIdAndUpdate(idConversation, newConversation, {
      timestamps: false,
    });
    return conversation.countMessseen;
  } catch (err) {
    // console.error(err);
  }
};

export const updateLastMessgae = async (data: any) => {
  try {
    const { idConversation, message, sender, imgMess } = data;
    const conversation = await ConversationModel.findById(idConversation);
    if (conversation) {
      conversation.lastMessage = message
        ? message
        : `đã gửi ${imgMess?.length} ảnh`;
      conversation.lastSend = sender;
      conversation.save();
    }
  } catch (err) {
    console.error(err);
  }
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
