import mongoose, { Schema } from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    idConversation: { type: String, ref: "Conversation" },
    sender: { type: String, required: true },
    message: { type: String, required: false },
    imgMess: { type: [String], require: false },
    videoMess: { type: [String], require: false },
    seen: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

// == Messages Model ==
export const MessagesModel = mongoose.model("messages", MessageSchema);

export const getAllMessagesByConversation = (idConversation: String) =>
  MessagesModel.find({
    idConversation,
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
