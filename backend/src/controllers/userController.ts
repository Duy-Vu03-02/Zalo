import express, { Request, Response, response } from "express";
import { authentication, comparePass } from "../helper/helper";
import multer from "multer";
import path from "path";
import {
  getUsers,
  getUserByPhone,
  getUsersById,
  createUser,
  deleUserById,
  updateUserById,
  getUserBySessionToken,
} from "../config/schema/schema";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers().select("avatarImage");
    if (users == null) {
      return res.sendStatus(403);
    }
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.sendStatus(400);
    }

    const user = await getUsersById(id);
    user.username = username;
    await user.save();
    return res.status(200).json(user).end();
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const userByPhone = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    const checkPhone = await getUserByPhone(phoneNumber);
    if (checkPhone) {
      return res.status(200).json(checkPhone).end();
    } else {
      return res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const loginBySessiToken = async (req: Request, res: Response) => {
  try {
    const { sessiontoken } = req.body;
    console.log(sessiontoken);
    const user = await getUserBySessionToken(sessiontoken).select(
      "authentication.sessionToken avatarImage"
    );
    if (!user) {
      return res.sendStatus(400);
    } else {
      if (user.authentication.sessionToken === sessiontoken) {
        const newSissionToken = await authentication(user._id.toString());
        user.authentication.sessionToken = newSissionToken;
        await user.save();
        return res.status(200).json(newSissionToken).end();
      }
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const loginByAccount = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.sendStatus(400);
    } else {
      const user = await getUserByPhone(phone).select(
        "authentication.phone authentication.password authentication.sessionToken avatarImage"
      );
      if (!user) {
        return res.sendStatus(404);
      } else {
        const checkPass = await comparePass(
          password,
          user.authentication.password
        );
        if (!checkPass) {
          return res.sendStatus(404);
        }
        if (checkPass) {
          const newSissionToken = await authentication(user._id.toString());
          user.authentication.sessionToken = newSissionToken;
          await user.save();
          user.authentication.password;
          const response_data = user.toObject();
          response_data.authentication.password = undefined;
          delete response_data.authentication.password;
          return res.status(200).json(response_data).end();
        }
      }
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { phone, password, name, avatar } = req.body;
    if (!phone || !password || !name || !avatar) {
      return res.sendStatus(403);
    } else {
      const checkPhone = await getUserByPhone(phone);
      if (checkPhone) {
        return res.sendStatus(300);
      } else {
        const newUser = await createUser({
          username: name,
          phone: phone,
          authentication: {
            password: await authentication(password),
          },
          avatarImage: avatar,
        });
        return res.status(200).json(newUser).end();
      }
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

const handleStorageImg = async () => {
  const uploadDir = path.join("D:/TypeScript/zalo-types/data", "avatar");
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now();
      callback(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  });
  const upload = multer({ storage: storage });
};
