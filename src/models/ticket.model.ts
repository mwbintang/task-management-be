import { Schema, model, Document, Types } from "mongoose";
import {
  TicketStatus,
  TicketPriority,
  CriticalLevel,
  TicketLevel,
  TicketCategory,
} from "../constants/enums/ticket.enum";

interface IAttachment {
  filename: string;
  url: string;
  mimetype: string;
  size?: number;
}

export interface ITicket extends Document {
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  criticalLevel?: CriticalLevel; // C1, C2, C3 (set by L2)
  level: TicketLevel
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

    category: {
      type: String,
      enum: Object.values(TicketCategory),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.NEW,
    },

    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.LOW,
    },

    criticalLevel: {
      type: String,
      enum: Object.values(CriticalLevel),
      default: null, // L1 does not set critical level
    },

    level: {
      type: String,
      enum: Object.values(TicketLevel),
      default: TicketLevel.L1, // ticket starts at L1
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

// Populate ticket logs
ticketSchema.virtual("ticketLogs", {
  ref: "TicketLog",
  localField: "_id",
  foreignField: "ticket",
});

ticketSchema.set("toObject", { virtuals: true });
ticketSchema.set("toJSON", { virtuals: true });

export const Ticket = model<ITicket>("Ticket", ticketSchema);
