import mongoose, { Schema } from "mongoose";

const ConversationSchema = new Schema(
  {
    type: { type: String, required: true },
    lastMessage: { type: String, ref: "Message" },
    member: [{ type: String, ref: "User" }],
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
