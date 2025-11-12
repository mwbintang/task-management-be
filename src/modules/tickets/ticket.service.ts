import mongoose, { Types } from "mongoose";
import { TicketStatus } from "../../constants/enums/ticket.enum";
import { FetchAllParams } from "../../types/ticket";
import { AppError } from "../../helpers/errors.helper";
import { Project, ProjectUser, Ticket, TicketLog } from "../../models";

export class TicketService {
  static async fetchAll(params: FetchAllParams = {}, userId: Types.ObjectId | undefined) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    // Step 1: Get all projects the user is connected to
    const projectLinks = await ProjectUser.find({ user: userId }).select("project");
    const projectIds = projectLinks.map(link => link.project);

    if (projectIds.length === 0) {
      return []; // User has no projects
    }

    const { search, status, priority, escalation } = params;

    // Step 2: Base query - tickets under user's projects
    const query: any = {
      project: { $in: projectIds },
      status: { $ne: "backlog" }
    };

    // Step 3: Add optional filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (escalation) query.criticalLevel = escalation;

    // Step 4: Add search filter (title, description, or ticketId)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { ticketId: { $regex: search, $options: "i" } },
      ];
    }

    // Step 5: Fetch tickets and populate relations
    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .populate("reporter", "name email")
      .populate("assignee", "name email");

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

  static async create(data: any) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const ticket = await Ticket.create([data], { session });
      await session.commitTransaction();
      return ticket[0];
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
