import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: false, min: 3, select: true },
    phone: {
      type: String,
      required: false,
      unique: true,
      select: false,
    },
    authentication: {
      password: { type: String, required: false, min: 6, select: false },
      saltRound: { type: Number, required: false, select: false },
      sessionToken: { type: String, required: false, min: 3, select: false },
      token: { type: String, required: false, select: false },
      refetchToken: { type: String, required: false, select: false },
    },
    avatar: { type: String, required: true, select: false },
    sex: { type: String, required: false, min: 3, select: false },
    dob: { type: Date, required: false, select: false },
    address: { type: String, required: false, select: false },
    lastActive: { type: String, required: true, select: true },
    friend: [{ type: String, ref: "User" }],
    friendSend: [{ type: String, ref: "User" }],
    friendRecieve: [{ type: String, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

// == Users Model ==
export const UserModel = mongoose.model("users", UserSchema);

export const getUsers = () => UserModel.find({});

export const getUsersById = (id: string) => UserModel.findById(id);

export const getFriendSend = (friendSend: string) =>
  UserModel.find({ friendSend });

export const getFriendRecieve = (friendRecieve: string) =>
  UserModel.find({ friendRecieve });

export const getUserByPhone = (phone: string) => UserModel.findOne({ phone });

export const getFriendByName = (username: string, userId: String) => {
  // return UserModel.find({
  //   $and: [
  //     { username: { $regex: new RegExp(username, "i") } },
  //     { friend: { $in: [userId] } },
  //   ],
  // });
  return UserModel.find({ username: { $regex: new RegExp(username, "i") } });
};

export const getUserByToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const createUser = async (userData: Record<string, any>) => {
  try {
    const newUser = new UserModel(userData);
    const user = await newUser.save();
    return user.toObject();
  } catch (err) {
    throw new Error(`Failed to create user: ${err.message}`);
  }
};

// ...

export const deleUserById = (id: string) => UserModel.findByIdAndDelete(id);

export const updateUserById = (id: string, updateData: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, updateData, { new: true });

// ...

// == ==
