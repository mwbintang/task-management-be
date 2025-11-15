import { Schema, model, Document, Types } from "mongoose";
import { TicketLevel } from "../constants/enums/ticket.enum";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: TicketLevel;
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
      enum: Object.values(TicketLevel),
      default: TicketLevel.L1,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
