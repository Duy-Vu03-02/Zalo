import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    message: { type: String, require: true },
    user: {
      from: { type: String, require: true },
      to: { type: String, require: true },
    },
    sender: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

// == Messages Model ==
export const MessagesModel = mongoose.model("messages", MessageSchema);

export const getMessages = (from: string, to: string) =>
  MessagesModel.find({ from, to });

export const createMessages = async (userMess: Record<string, any>) => {
  try {
    const newMess = new MessagesModel(userMess);
    const mess = await newMess.save();
    return mess.toObject();
  } catch (err) {
    throw new Error(`Failed to create mess: ${err.message}`);
  }
};
