import { Schema, model } from "mongoose";
import * as types from "@commons/types";

const ProjectSchema = new Schema<types.IProject>({
  name: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  isPrivate: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
});
export const Project = model<types.IProject>("Project", ProjectSchema);
