import { Schema, model, Document, Types } from "mongoose";

export interface IProjectUser extends Document {
  user: Types.ObjectId;
  project: Types.ObjectId;
  role?: string; // optional, e.g. "owner", "member"
  createdAt: Date;
  updatedAt: Date;
}

const projectUserSchema = new Schema<IProjectUser>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    role: { type: String, enum: ["owner", "member"], default: "member" },
  },
  { timestamps: true }
);

export const ProjectUser = model<IProjectUser>("ProjectUser", projectUserSchema);
