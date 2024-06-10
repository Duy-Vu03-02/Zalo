import mongoose, { Schema } from "mongoose";
import { UserModel } from "./UserModel";

const ConversationSchema = new Schema(
  {
    type: { type: String, required: true },
    lastMessage: { type: String, ref: "Message" },
    lastSend: { type: String, ref: "User" },
    member: [{ type: String, ref: "User" }],
    groupName: { type: String, required: false },
    avatarGroup: { type: String, required: false },
    lastActive: { type: Date, required: false },
    countMessseen: { type: String, required: false, default: "0" },
    softConversation: { type: Boolean, required: false, default: false },
  },
  {
    timestamps: true,
  }
);

// == Conversation Model ==

export const ConversationModel = mongoose.model(
  "Conversation",
  ConversationSchema
);

export const getConversationById = (id: String) => UserModel.findById(id);
