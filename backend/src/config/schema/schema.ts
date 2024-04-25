import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: false, min: 3, select: true },
    phone: {
      type: String,
      required: false,
      min: 6,
      unique: true,
      select: false,
    },
    authentication: {
      password: { type: String, required: false, min: 6, select: false },
      saltRound: { type: Number, required: false, select: false },
      sessionToken: { type: String, required: false, min: 3, select: false },
    },
    avatarImage: { type: String, required: true, select: false },
    sex: { type: String, required: false, min: 3, select: false },
    dob: { type: Date, required: false, select: false },
    address: { type: String, required: false, selecte: false },
  },
  {
    timestamps: true,
  }
);

// == Users Model ==
export const UserModel = mongoose.model("users", UserSchema);

export const getUsers = () => UserModel.find({});

export const getUsersById = (id: string) => UserModel.findById(id);

export const getUserByPhone = (phone: string) => UserModel.findOne({ phone });

export const getUserBySessionToken = (sessionToken: string) =>
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
