import { model, Schema } from "mongoose";

import { SYS_GENDAR, SYS_ROLES } from "../../../common/index.js";

console.log(SYS_GENDAR);

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    provider: { type: String, enum: ["google", "system"], default: "system" },
    password: {
      type: String,
      required: function () {
        if (this.provider === "google") return false;
        return true;
      },
    },
    gendar: { type: Number, enum: Object.values(SYS_GENDAR) },
    role: {
      type: Number,
      enum: Object.values(SYS_ROLES),
      default: SYS_ROLES.user,
    },
    phoneNumber: {
      type: { iv: String, algorithm: String, number: String },
      required: function () {
        if (this.email) return false;
        return true;
      },
    },
    profileImage: String,

    is_verified: { type: Boolean, default: true },
    creadintialsAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  },
);

export const User = model("User", schema);
