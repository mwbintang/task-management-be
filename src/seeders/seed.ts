import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { env } from "../constants/env";
import { User, Project, ProjectUser, Ticket, Comment, TicketLog } from "../models";

async function seed() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // --- Clear existing data ---
    await User.deleteMany({});
    await Project.deleteMany({});
    await ProjectUser.deleteMany({});
    await Ticket.deleteMany({});
    await Comment.deleteMany({});
    await TicketLog.deleteMany({});
    console.log("🗑️ Cleared old data");

    // --- Create Users ---
    const users = await User.insertMany([
      {
        name: "Alice L1",
        email: "alice@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "L1",
      },
      {
        name: "Bob L2",
        email: "bob@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "L2",
      },
      {
        name: "Charlie L3",
        email: "charlie@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "L3",
      },
    ]);
    console.log("👤 Users created");

    // --- Create Projects ---
    const projects = await Project.insertMany([
      { name: "Project Alpha", description: "First test project" },
      { name: "Project Beta", description: "Second test project" },
    ]);
    console.log("📁 Projects created");

    // --- Connect Users & Projects ---
    await ProjectUser.insertMany([
      { user: users[0]._id, project: projects[0]._id, role: "owner" },
      { user: users[1]._id, project: projects[0]._id, role: "member" },

      { user: users[1]._id, project: projects[1]._id, role: "owner" },
      { user: users[2]._id, project: projects[1]._id, role: "member" },
    ]);
    console.log("🔗 ProjectUser relations created");

    // --- Create Tickets ---
    const now = new Date();
    const tickets = await Ticket.insertMany([
      {
        title: "Login issue",
        description: "User cannot login with correct password",
        category: "bug",
        status: "new",
        priority: "high",
        criticalLevel: null,       // L1 cannot set this
        level: "L1",
        project: projects[0]._id,
        reporter: users[0]._id,
        assignee: users[0]._id,
        attachments: [],
        comments: [],
        expectedDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: "Payment page error",
        description: "Checkout button not working",
        category: "feature",
        status: "new",
        priority: "medium",
        criticalLevel: "C2",       // only L2 sets this
        level: "L2",
        project: projects[1]._id,
        reporter: users[1]._id,
        assignee: users[1]._id,
        attachments: [],
        comments: [],
        expectedDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log("🎫 Tickets created");

    // --- Create Comments ---
    const comments = await Comment.insertMany([
      {
        user: users[0]._id,
        ticket: tickets[0]._id,
        message: "Initial comment on ticket 1",
      },
      {
        user: users[1]._id,
        ticket: tickets[1]._id,
        message: "Follow-up comment on ticket 2",
      },
    ]);
    console.log("💬 Comments created");

    // Attach comments
    await Ticket.updateOne(
      { _id: tickets[0]._id },
      { $push: { comments: comments[0]._id } }
    );
    await Ticket.updateOne(
      { _id: tickets[1]._id },
      { $push: { comments: comments[1]._id } }
    );

    // --- Create Ticket Logs ---
    await TicketLog.insertMany([
      {
        ticket: tickets[0]._id,
        performedBy: users[0]._id,
        action: "Created",
        note: "Initial ticket created",
      },
      {
        ticket: tickets[1]._id,
        performedBy: users[1]._id,
        action: "Created",
        note: "Initial ticket created",
      },
    ]);
    console.log("📝 Ticket logs created");

    console.log("✅ Database seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
