import express, { Request, Response } from "express";
import { authentication, comparePass } from "../helper/helper";
import multer from "multer";
import path from "path";
import {
  getUsers,
  getUserByPhone,
  getUserByName,
  getUsersById,
  getUserBySessionToken,
  createUser,
  deleUserById,
  updateUserById,
  UserModel,
} from "../config/schema/userModel";
import { get } from "lodash";

// export const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const users = await getUsers().select("avatarImage");
//     if (users == null) {
//       return res.sendStatus(403);
//     }
//     return res.status(200).json(users);
//   } catch (err) {
//     console.error(err);
//     return res.sendStatus(400);
//   }
// };

export const HUY_LOI_MOI_KET_BAN = "Hủy lời mời kết bạn";
export const KET_BAN = "Kết bạn";
export const DONG_Y = "Đồng ý";
export const BAN_BE = "Bạn bè";
export const HUY = "Hủy";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await getUsersById(id).select("friend");
    const listFrinend = user.friend;
    if (listFrinend.length > 0) {
      const friends = await UserModel.find({
        _id: { $in: listFrinend },
      }).select("avatarImage");
      return res.status(200).json(friends);
    } else {
      return res.sendStatus(204);
    }
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
    const { phone, id } = req.body;
    const user = await getUsersById(id).select(
      "friend friendSend friendRecieve"
    );
    if (user) {
      const friends = user.friend;
      const friendSends = user.friendSend;
      const friendRecieves = user.friendRecieve;

      const number = await getUserByPhone(phone).select("phone avatarImage");
      if (number) {
        if (!friends.includes(number._id)) {
          const newRespone = {
            data: number,
            state: "",
            cancel: "",
          };
          if (friendSends.includes(number._id)) {
            newRespone.state = HUY_LOI_MOI_KET_BAN;
          } else if (friendRecieves.includes(number._id)) {
            newRespone.state = DONG_Y;
            newRespone.cancel = HUY;
          } else {
            newRespone.state = KET_BAN;
          }
          return res.status(200).json(newRespone);
        } else {
          return res.status(200).json({ data: number, state: BAN_BE });
        }
      } else {
        return res.status(203).json({
          state: "Số điện thoại chưa đăng ký hoặc không cho phép tìm kiếm",
        });
      }
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const crudfriend = async (req: Request, res: Response) => {
  try {
    const { userId, friendId, state } = req.body;
    const user = await getUsersById(userId).select(
      "friend friendSend friendRecieve"
    );
    const friend = await getUsersById(friendId).select(
      "friend friendSend friendRecieve"
    );

    if (user && friend) {
      if (state === KET_BAN) {
        user.friendSend.push(friend._id);
        friend.friendRecieve.push(user._id);
        user.save();
        friend.save();
      }

      if (state === DONG_Y) {
        const zUser = user.friendRecieve.indexOf(user._id);
        const zFriend = friend.friendSend.indexOf(friend._id);
        user.friendRecieve.splice(zUser, 1);
        friend.friendSend.splice(zFriend, 1);
        user.friend.push(friend._id);
        friend.friend.push(user._id);
        user.save();
        friend.save();
      }

      if (state === HUY) {
        const zUser = user.friendRecieve.indexOf(friend._id);
        const zFriend = friend.friendSend.indexOf(user._id);
        user.friendRecieve.splice(zUser, 1);
        friend.friendSend.splice(zFriend, 1);
        user.save();
        friend.save();
      }

      if (state === HUY_LOI_MOI_KET_BAN) {
        const zUser = user.friendSend.indexOf(friend._id);
        const zFriend = friend.friendRecieve.indexOf(user._id);
        user.friendSend.splice(zUser, 1);
        friend.friendRecieve.splice(zFriend, 1);
        user.save();
        friend.save();
      }
      return res.sendStatus(200);
    } else {
      return res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const userByName = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const lowerName = username.toLowerCase();
    const checkUserName = await getUserByName(lowerName).select("avatarImage");
    if (!checkUserName || checkUserName.length === 0) {
      return res.status(204).json({ mess: "null" });
    } else {
      return res.status(200).json(checkUserName).end();
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const loginBySessiToken = async (req: Request, res: Response) => {
  try {
    const { sessiontoken } = req.body;
    const user = await getUserBySessionToken(sessiontoken).select(
      "authentication.sessionToken avatarImage"
    );
    if (!user) {
      return res.status(400).json("Không tồn tại user");
    } else {
      if (user.authentication.sessionToken === sessiontoken) {
        const newSissionToken = await authentication(user._id.toString());
        user.authentication.sessionToken = newSissionToken;
        await user.save();
        return res.status(200).json(user).end();
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
          user.authentication.password as string
        );
        if (!checkPass) {
          return res.sendStatus(404);
        }
        if (checkPass) {
          const newSessionToken = await authentication(user._id.toString());
          user.authentication.sessionToken = newSessionToken;
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

export const handleStorageImg = async () => {
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
