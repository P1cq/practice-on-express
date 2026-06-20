import mongoose, { Schema, model } from "mongoose";

const schema = new Schema(
  {
    content: {
      type: String,
      minLength: 3,
      required: function () {
        if (!this.attechments || this.attechments.length === 0) return true;
        return false;
      },
    },
    attachments: {
      type: [String],
    },

    resiverId: { type: Schema.ObjectId, ref: "User", required: true },
    senderId: { type: Schema.ObjectId, ref: "User", required: false },
  },
  {
    timestamps: true,
  },
);

export const Message = model("Message", schema);
