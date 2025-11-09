import { Schema, model, Document } from "mongoose";

export enum UserRole {
  L1 = "L1",
  L2 = "L2",
  L3 = "L3",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.L1,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
