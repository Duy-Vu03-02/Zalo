import express, { NextFunction, Request, Response } from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "config/schema/schema";

export const isAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies["sessionToKen"];
    if (!sessionToken) {
      return res.sendStatus(403);
    }
    return next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const isOwn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    const currentUserId = get(req, "identity._id");

    if (!currentUserId) {
      return res.sendStatus(403);
    }
    if (currentUserId !== id) {
      return res.sendStatus(403);
    }
    return next();
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
