import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  ticket: Types.ObjectId; // linked to Ticket
  user: Types.ObjectId; // linked to User
  message: string; // rich text / HTML
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    ticket: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: {
      type: String,
      required: true,
      trim: false, // allow raw HTML input (no trimming)
    },
  },
  { timestamps: true }
);

export const Comment = model<IComment>("Comment", commentSchema);
