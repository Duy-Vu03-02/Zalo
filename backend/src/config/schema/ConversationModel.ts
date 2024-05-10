import mongoose, { Schema } from "mongoose";

const ConversationSchema = new Schema(
  {
    type: { type: String, required: true },
    lastMessage: { type: String, ref: "Message" },
    lastSend: { type: String, ref: "User" },
    member: [{ type: String, ref: "User" }],
    groupName: { type: String, required: false },
    avatarGroup: { type: String, required: false },
    lastActive: { type: Date, required: false },
    countMessseen: { type: String, required: false },
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