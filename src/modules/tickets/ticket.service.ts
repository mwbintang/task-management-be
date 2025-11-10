import mongoose, { Types } from "mongoose";
import { TicketStatus } from "../../constants/enums/ticket.enum";
import { FetchAllParams } from "../../constants/types/ticket.type";
import { AppError } from "../../helpers/errors.helper";
import { Ticket, TicketLog } from "../../models";

export class TicketService {
  static async fetchAll(params: FetchAllParams = {}) {
    const { search, status, priority, escalation } = params;

    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (escalation) query.criticalLevel = escalation;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { ticketId: { $regex: search, $options: "i" } },
      ];
    }

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .populate("reporter", "name email")
      .populate("assignee", "name email")

    return tickets;
  }

  static async updateStatus(ticketId: string, newStatus: TicketStatus, userId: Types.ObjectId | undefined) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const ticket = await Ticket.findById(ticketId).session(session);
      if (!ticket) {
        throw new AppError("Ticket not found", 404);
      }

      if (!userId) {
        throw new AppError("User not found", 404);
      }

      const oldStatus = ticket.status;
      ticket.status = newStatus;
      await ticket.save({ session });
      await TicketLog.create(
        [
          {
            ticket: ticket._id,
            action: "STATUS_UPDATED",
            note: `Status changed from ${oldStatus} to ${newStatus}`,
            performedBy: userId,
            fromLevel: oldStatus,
            toLevel: newStatus,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return { success: true, ticket };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
