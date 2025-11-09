import { Schema, model, Document, Types } from "mongoose";

interface IAttachment {
  filename: string;
  url: string; // could be S3, local, etc.
  mimetype: string;
  size?: number; // optional file size in bytes
}

export interface ITicket extends Document {
  title: string;
  description: string;
  status: "backlog" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  criticalLevel: "L1" | "L2" | "L3";
  project: Types.ObjectId;
  assignee?: Types.ObjectId;
  reporter: Types.ObjectId;
  attachments: IAttachment[]; // 🧩 new field
  comments: Types.ObjectId[]; // 🧩 comment refs
  createdAt: Date;
  updatedAt: Date;
}

const attachmentSchema = new Schema<IAttachment>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number },
  },
  { _id: false }
);

const ticketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["backlog", "in_progress", "resolved", "closed"],
      default: "backlog",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    criticalLevel: {
      type: String,
      enum: ["L1", "L2", "L3"],
      default: "L1",
    },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attachments: [attachmentSchema],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const Ticket = model<ITicket>("Ticket", ticketSchema);
