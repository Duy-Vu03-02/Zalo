import express, { NextFunction, Request, Response } from "express";
import mongoose, { Schema } from "mongoose";
import {
  authentication,
  comparePass,
  descryptJWT,
  genderJWT,
} from "../helper/helper";
import multer from "multer";
import path from "path";
import { fromPairs, get, max } from "lodash";
import { createConversation } from "./ConverationController";
import { MessagesModel } from "../config/schema/MessageModel";
import {
  UserModel,
  createUser,
  getUsers,
  getFriendRecieve,
  getFriendSend,
  getFriendByName,
  getUserByPhone,
  getUserByToken,
  getUsersById,
  deleUserById,
  updateUserById,
} from "../config/schema/UserModel";
import { ConversationModel } from "../config/schema/ConversationModel";
import { GroupModel } from "../config/schema/GroupModel";

export const HUY_LOI_MOI_KET_BAN = "Thu hồi lời mời";
export const KET_BAN = "Kết bạn";
export const DONG_Y = "Đồng ý";
export const BAN_BE = "Bạn bè";
export const XOA_BAN_BE = "Xóa bạn bè";
export const BO_QUA = "Bỏ qua";
export const ACTIVE = "Active";

export const calculatorLastActive = async (timeInput: any) => {
  if (timeInput === ACTIVE) {
    return ACTIVE;
  } else {
    const lastDate = new Date(timeInput);
    const nowDate = new Date();

    const farMonth = nowDate.getMonth() - lastDate.getMonth();
    if (farMonth > 1) {
      return `${lastDate.getDate()}/${
        lastDate.getMonth() + 1
      }/${lastDate.getFullYear()}`;
    } else {
      const farDate = nowDate.getTime() - lastDate.getTime();
      if (farDate >= 2_592_000_000) {
        return `${lastDate.getDate()}/${
          lastDate.getMonth() + 1
        }/${lastDate.getFullYear()}`;
      } else {
        if (farDate >= 86_400_000) {
          return `${Math.floor(farDate / 86_400_000)} ngày`;
        } else if (farDate > 3_600_000) {
          return `${Math.floor(farDate / 3_600_600)} giờ`;
        } else if (farDate >= 60_000) {
          return `${Math.floor(farDate / 60000)} phút`;
        } else {
          return `vừa xong`;
        }
      }
    }
  }
};

export const getAllFriend = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await getUsersById(id).select("friend");
    const listFrinend = user.friend;
    if (listFrinend.length > 0) {
      const friends: any = await UserModel.find({
        _id: { $in: listFrinend },
      }).select("avatar updatedAt");
      const newfriends = await Promise.all(
        friends.map(async (item: any) => {
          item.lastActive = await calculatorLastActive(item.lastActive);
          return item;
        })
      );
      return res.status(200).json(newfriends);
    } else {
      return res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const getAllGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await UserModel.findById(id).select("group");
    // if (user) {
    //   const listIdGroup = user.groupReceived;
    //   if (listIdGroup) {
    //     const groups = await GroupModel.findById({
    //       _id: { $in: listIdGroup },
    //     }).select("groupName avatarImage");
    //     return res.status(200).json(groups);
    //   }
    // }
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};
export const getGroupReq = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await UserModel.findById(id).select("groupReceived");
    // if (user) {
    //   const groupReq = user.groupReq;
    //   if (groupReq?.length > 0) {
    //     const groupsReq = groupReq.map(async (item: String) => {
    //       const group = await GroupModel.findById(item);
    //       return group;
    //     });
    //     return res.status(200).json(await groupsReq());
    //   }
    // }
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const getFriendRes = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await UserModel.findById(id).select("friendRecieve");
    if (true) {
      const friendRes = user.friendRecieve;
      if (friendRes) {
        const friendRess = await UserModel.find({
          _id: { $in: friendRes },
        }).select("username avatar");
        const newfriends = await Promise.all(
          friendRess.map(async (item: any) => {
            item.lastActive = await calculatorLastActive(item.lastActive);
            return item;
          })
        );
        return res.status(200).json(newfriends);
      }
    }
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const getFriendReq = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const user = await UserModel.findById(id).select("friendSend");

    if (user) {
      const friendReq = user.friendSend;
      if (friendReq?.length > 0) {
        const friendReqs = await UserModel.find({
          _id: { $in: friendReq },
        }).select("username avatar");

        const newFriendReq = await Promise.all(
          friendReqs.map(async (item: any) => {
            item.lastActive = await calculatorLastActive(item.lastActive);
            const { lastActive, avatar, _id, username } = item;
            return { lastActive, avatar, _id, username };
          })
        );
        return res.status(200).json(newFriendReq);
      }
    }
    return res.sendStatus(204);
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

      if (number && number._id == id) {
        return res.status(203).json({
          state: "Không thể thêm bản thân thành bạn bè",
        });
      }

      if (number) {
        const checkInFriend = friends.includes(number._id.toString());

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
            newRespone.cancel = BO_QUA;
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
          user.friend.push(friendId);
          friend.friend.push(userId);
          await friend.save();
          await user.save();
          const newConversation = createConversation(userId, friendId);
          return res.status(200).json(newConversation);
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

      if (state === BO_QUA) {
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
        const zUser = user.friend.indexOf(friendId);
        const zFriend = friend.friend.indexOf(userId);

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

export const getUserById = async (friendId: any) => {
  try {
    const friend: any = await getUsersById(friendId).select(
      "username avatar lastActive "
    );
    friend.lastActive = await calculatorLastActive(friend.lastActive);
    if (friend) {
      return friend;
    }
  } catch (err) {
    console.error(err);
  }
};

export const friendByName = async (req: Request, res: Response) => {
  try {
    const { friendName, userId } = req.body;
    const lowerName = friendName.toLowerCase();
    const checkUserName = await getFriendByName(lowerName, userId).select(
      "avatar"
    );
    if (!checkUserName || checkUserName.length === 0) {
      return res.status(204).json({ mess: "null" });
    } else {
      for (let temp of checkUserName) {
        temp.lastActive = await calculatorLastActive(temp.lastActive);
      }
      return res.status(200).json(checkUserName).end();
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const loginByToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token || null;

    if (token) {
      const user = await UserModel.findOne({
        "authentication.token": token,
      }).select("avatar username authentication.token phone");

      if (user) {
        const newUser = user.toObject();
        delete newUser.authentication;
        return res.status(200).json({
          ...newUser,
        });
      }
    }

    return res.sendStatus(204);
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
        "phone authentication.password avatar authentication.token"
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
          const bodyJwt = {
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            phone: user.phone,
          };

          // Tao newToken
          const newToken = genderJWT({ ...bodyJwt, avatar: undefined });
          user.authentication.token = newToken;
          await user.save();

          res.cookie("token", newToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 60,
            secure: true,
            sameSite: "strict",
          });

          return res.status(200).json(bodyJwt).end();
        }
      }
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 0,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const register = async (req: Request, res: Response) => {
  try {
    const { phone, password, name, avatar } = req.body;
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
          lastActive: ACTIVE,
        });
        return res.status(200).json(newUser).end();
      }
    }
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const { url, userId } = req.body;
    const user = await UserModel.findById(userId);
    if (user) {
      user.avatar = url;
      user.save();
      res.sendStatus(200);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
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
