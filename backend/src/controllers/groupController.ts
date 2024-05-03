import express, { Request, Response } from "express";
import { getAllGr, createGr, getGr } from "../config/schema/groupModel";

export const getAllGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const messages = await getAllGr(id);
    if (messages) {
      return res.status(200).json(messages);
    } else {
      return res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const createGrroup = async (req: Request, res: Response) => {
  try {
    const { groupName, member, avatarImage } = req.body;
    const newGr = await createGr({
      member: member,
      groupName: groupName,
      avatarImage: avatarImage,
    });
    if (newGr) {
      return res.status(200).json(newGr);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const newMessGr = async (req: Request, res: Response) => {
  try {
    const { _id, message, sender } = req.body;
    const gr = await getGr(_id);
    if (gr) {
      gr.messages.push({
        message: message,
        sender: sender,
      });
      gr.save();
      return res.sendStatus(200);
    } else {
      return res.sendStatus(400);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};
