import express, { Request, Response } from "express";
import mongoose, { Schema } from "mongoose";
import { authentication, comparePass } from "../helper/helper";
import multer from "multer";
import path from "path";
import { get } from "lodash";
import { MessagesModel } from "../config/schema/MessageModel";
import {
  UserModel,
  createUser,
  getUsers,
  getFriendRecieve,
  getFriendSend,
  getUserByName,
  getUserByPhone,
  getUserBySessionToken,
  getUsersById,
  deleUserById,
  updateUserById,
} from "../config/schema/UserModel";
import { ConversationModel } from "../config/schema/ConversationModel";

export const HUY_LOI_MOI_KET_BAN = "Hủy lời mời kết bạn";
export const KET_BAN = "Kết bạn";
export const DONG_Y = "Đồng ý";
export const BAN_BE = "Bạn bè";
export const XOA_BAN_BE = "Xóa kết bạn";
export const HUY = "Hủy";

export const getAllFriend = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await getUsersById(id).select("friend.");
    const listFrinend = user.friend;
    if (listFrinend.length > 0) {
      const friends = await UserModel.find({
        _id: { $in: listFrinend },
      }).select("avatar updatedAt");
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
      const number = await getUserByPhone(phone).select("phone avatar");

      if (number) {
        const checkInFriend: boolean = friends.some(
          (item: any) => item.idUser == number._id
        );

        if (!checkInFriend) {
          const newRespone = {
            data: number,
            state: "",
            cancel: "",
            unfriend: "",
          };
          if (friendSends.includes(number._id.toString())) {
            newRespone.state = HUY_LOI_MOI_KET_BAN;
          } else if (friendRecieves.includes(number._id.toString())) {
            newRespone.state = DONG_Y;
            newRespone.cancel = HUY;
          } else {
            newRespone.state = KET_BAN;
          }
          return res.status(200).json(newRespone);
        } else {
          return res
            .status(200)
            .json({ data: number, state: BAN_BE, unfriend: XOA_BAN_BE });
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
      const optionResult = {
        state: "",
        show: true,
        cancel: "",
        unfriend: "",
      };
      if (state === KET_BAN) {
        const checkUser = user.friendSend.includes(friendId);
        const checkFriend = friend.friendRecieve.includes(userId);
        if (!checkUser && !checkFriend) {
          user.friendSend.push(friendId);
          friend.friendRecieve.push(userId);
          user.save();
          friend.save();
        } else {
          return res.sendStatus(204);
        }
      }

      if (state === DONG_Y) {
        const zUser = user.friendRecieve.indexOf(friendId);
        const zFriend = friend.friendSend.indexOf(userId);
        if (zUser >= 0 && zFriend >= 0) {
          user.friendRecieve.splice(zUser, 1);
          friend.friendSend.splice(zFriend, 1);
          const newConversation = new ConversationModel({
            type: "single",
            member: [userId, friendId],
          });
          await newConversation.save();

          user.friend.push({
            idUser: friendId,
            idConversation: newConversation._id,
          });
          friend.friend.push({
            idUser: userId,
            idConversation: newConversation.id,
          });

          await user.save();
          await friend.save();
        }
      }

      if (state === HUY_LOI_MOI_KET_BAN) {
        const zUser: number = user.friendSend.indexOf(friendId);
        const zFriend: number = friend.friendRecieve.indexOf(userId);
        if (zUser >= 0 && zFriend >= 0) {
          user.friendSend.splice(zUser, 1);
          friend.friendRecieve.splice(zFriend, 1);
          user.save();
          friend.save();
        }
      }

      if (state === HUY) {
        const zUser = user.friendRecieve.indexOf(friendId);
        const zFriend = friend.friendSend.indexOf(userId);
        if (zUser >= 0 && zFriend >= 0) {
          user.friendRecieve.splice(zUser, 1);
          friend.friendSend.splice(zFriend, 1);
          user.save();
          friend.save();
        }
      }

      if (state === XOA_BAN_BE) {
        let zUser = -1;
        let zFriend = -1;
        user.friend.map((item: any, index: number) => {
          if (item.idUser == friendId) {
            zUser = index;
          }
        });
        friend.friend.map((item: any, index: number) => {
          if (item.idUser == userId) {
            zFriend = index;
          }
        });

        if (zUser >= 0 && zFriend >= 0) {
          user.friend.splice(zUser, 1);
          friend.friend.splice(zFriend, 1);
          user.save();
          friend.save();
        }
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
    const checkUserName = await getUserByName(lowerName).select("avatar");
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
      "authentication.sessionToken avatar"
    );
    if (!user) {
      return res.status(205).json("Không tồn tại user");
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
        "authentication.phone authentication.password authentication.sessionToken avatar"
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
    console.log();
    if (!phone || !password || !name || !avatar) {
      return res.sendStatus(403);
    } else {
      const checkPhone = await UserModel.findOne({ phone: phone }).select(
        "phone"
      );
      if (checkPhone) {
        return res.sendStatus(300);
      } else {
        const newUser = await createUser({
          username: name,
          phone: phone,
          authentication: {
            password: await authentication(password),
          },
          avatar: avatar,
        });
        return res.status(200).json(newUser).end();
      }
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

// export const handleStorageImg = async () => {
//   const uploadDir = path.join("D:/TypeScript/zalo-types/data", "avatar");
//   const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//       callback(null, uploadDir);
//     },
//     filename: (req, file, callback) => {
//       const uniqueSuffix = Date.now();
//       callback(
//         null,
//         file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//       );
//     },
//   });
//   const upload = multer({ storage: storage });
// };
