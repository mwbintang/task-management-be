import { Schema, model, Document, Types } from "mongoose";
import { TicketStatus, TicketPriority, CriticalLevel } from "../constants/enums/ticket.enum";

interface IAttachment {
  filename: string;
  url: string;
  mimetype: string;
  size?: number;
}

export interface ITicket extends Document {
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  criticalLevel: CriticalLevel;
  project: Types.ObjectId;
  assignee?: Types.ObjectId;
  reporter: Types.ObjectId;
  attachments: IAttachment[];
  comments: Types.ObjectId[];
  expectedDate?: Date;
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
      enum: Object.values(TicketStatus),
      default: TicketStatus.BACKLOG,
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.LOW,
    },
    criticalLevel: {
      type: String,
      enum: Object.values(CriticalLevel),
      default: CriticalLevel.L1,
    },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attachments: [attachmentSchema],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    expectedDate: { type: Date },
  },
  { timestamps: true }
);

export const Ticket = model<ITicket>("Ticket", ticketSchema);
