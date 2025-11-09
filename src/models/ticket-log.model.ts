import { Schema, model, Document, Types } from "mongoose";

export interface ITicketLog extends Document {
  ticket: Types.ObjectId;
  action: string;
  note?: string;
  performedBy: Types.ObjectId;
  fromLevel?: string;
  toLevel?: string;
  createdAt: Date;
}

const ticketLogSchema = new Schema<ITicketLog>(
  {
    ticket: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    action: { type: String, required: true },
    note: { type: String },
    performedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fromLevel: { type: String },
    toLevel: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const TicketLog = model<ITicketLog>("TicketLog", ticketLogSchema);
