import mongoose, { Schema } from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    idConversation: { type: String, ref: "Conversation" },
    sender: { type: String, required: true },
    message: { type: String, required: true },
    seen: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

// == Messages Model ==
export const MessagesModel = mongoose.model("messages", MessageSchema);

export const getMessages = (from: string, to: string) =>
  MessagesModel.find({
    $or: [
      {
        $and: [{ "user.from": from }, { "user.to": to }],
      },
      {
        $and: [{ "user.from": to }, { "user.to": from }],
      },
    ],
  });

export const createMessages = async (userMess: Record<string, any>) => {
  try {
    const newMess = new MessagesModel(userMess);
    const mess = await newMess.save();
    return mess.toObject();
  } catch (err) {
    throw new Error(`Failed to create mess: ${err.message}`);
  }
};
