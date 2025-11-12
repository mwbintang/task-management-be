import { Types } from "mongoose";
import { IProject, Project, ProjectUser } from "../../models";
import { AppError } from "../../helpers/errors.helper";

export class ProjectService {
  static async getAll(userId: Types.ObjectId | undefined) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    }

    // Step 1: Find all project-user relations for the user
    const projectLinks = await ProjectUser.find({ user: userId }).select("project");

    // Step 2: Extract project IDs
    const projectIds = projectLinks.map((link) => link.project);

    // Step 3: Fetch the actual projects
    const projects = await Project.find({ _id: { $in: projectIds } })
      .sort({ createdAt: -1 });

    return projects;
  }

  static async create(data: Partial<IProject>, userId: Types.ObjectId | undefined) {
    if (!userId) {
      throw new AppError("User ID is required", 400);
    };

    return Project.create({ ...data, user: userId });
  }
};
