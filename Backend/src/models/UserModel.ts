import bcrypt from "bcryptjs";
import type { User } from "../types/UserType.js";

import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      required: false,
      default:""
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      required: false,
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }

  const hashPassword = await bcrypt.hash(this.password, 10);
  this.password = hashPassword;
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const UserModel = model<User>("User", UserSchema);
