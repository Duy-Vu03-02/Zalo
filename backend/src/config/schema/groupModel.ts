import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    messages: [
      {
        message: { type: String, required: true },
        sender: { type: String, required: true },
      },
    ],
    member: { type: [String], required: true },
    totalMember: { type: Number, required: false, default: 2 },
    avatarImage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const GroupModel = mongoose.model("groups", GroupSchema);

export const getGr = async (id: string) => GroupModel.findById({ id });

export const getAllGr = async (id: string) =>
  GroupModel.find({ member: { $in: [id] } });

export const createGr = async (gr: Record<string, any>) => {
  try {
    const newGr = new GroupModel(gr);
    const group = await newGr.save();
    return group.toObject();
  } catch (err) {
    throw new Error(`Failed to create Group: ${err.message}`);
  }
};
