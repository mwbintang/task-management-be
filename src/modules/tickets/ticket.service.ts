import mongoose, { Types } from "mongoose";
import { TicketStatus } from "../../constants/enums/ticket.enum";
import { FetchAllParams } from "../../types/ticket";
import { AppError } from "../../helpers/errors.helper";
import { ProjectUser, Ticket, TicketLog, User } from "../../models";

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
    };

    const { search, status, priority, escalation, category } = params;

    // Step 2: Base query - tickets under user's projects
    const query: any = {
      project: { $in: projectIds }
    };

    // Step 3: Add optional filters
    if (status) {
      query.status = status;
    };

    if (priority) {
      query.priority = priority;
    };

    if (escalation) {
      query.level = escalation;
    };

    if (category) {
      query.category = category;
    };

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

  static async fetchById(ticketId: string) {
    if (!ticketId) {
      throw new AppError("Ticket ID is required", 400);
    }

    return Ticket.findOne({ _id: ticketId })
      .populate("project")
      .populate("assignee")
      .populate("reporter")
      .populate("comments")
      .populate({
        path: "ticketLogs",            // ✅ virtual populate
        populate: { path: "performedBy", select: "name email" }, // optional deeper populate
      });
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
            action: "Status Update",
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

  static async updateTicketLevel(ticketId: any, body: any, userId: any) {
    const {newLevel, note} = body
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Fetch user
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error("User not found");
      }

      const ticket = await Ticket.findById(ticketId).session(session);
      if (!ticket) {
        throw new Error("Ticket not found");
      }

      const userRole = user.role;

      // Allowed access by role
      const roleAccess = {
        L1: ["L1"],
        L2: ["L1", "L2"],
        L3: ["L1", "L2", "L3"],
      };

      if (!roleAccess[userRole].includes(ticket.level)) {
        throw new Error(
          `Role ${userRole} cannot modify a ticket with level ${ticket.level}`
        );
      }

      // Valid levels
      const validLevels = ["L1", "L2", "L3"];
      if (!validLevels.includes(newLevel)) {
        throw new Error("Invalid level");
      }

      // Update ticket level
      ticket.level = newLevel;
      await ticket.save({ session });

      // Create Ticket Log
      await TicketLog.create(
        [
          {
            ticket: ticket._id,
            performedBy: user._id,
            action: "Level Changed",
            note: note,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        success: true,
        message: "Ticket level updated successfully",
        data: ticket,
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  static async create(data: any, userId: Types.ObjectId | undefined) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1️⃣ Create the new ticket
      const [ticket] = await Ticket.create([data], { session });

      // 2️⃣ Create the ticket log (initial creation)
      await TicketLog.create(
        [
          {
            ticket: ticket._id,
            action: "Created",
            note: `Ticket created by user ${userId}`,
            performedBy: userId,
            fromLevel: null,
            toLevel: ticket.status || "new",
          },
        ],
        { session }
      );

      // 3️⃣ Commit transaction
      await session.commitTransaction();
      return ticket;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
