import { Types, Schema, model, HydratedDocument } from "mongoose";
import { setDefaultProjectForUserWithoutSave } from "@utilities";
import * as types from "@commons/types";
import { Project, Role } from "@models";
import { adminPermissions } from "@dbmethods/authorization";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const uniqueValidator = require("mongoose-unique-validator");

const createDefaultProject = async (userDoc: types.IUser) => {
  const project: HydratedDocument<types.IProject> = new Project({
    name: `${userDoc.name}&&${userDoc._id?.toString()}`,
    isPrivate: true,
    isDefault: true,
  });
  const role: HydratedDocument<types.IRole> = new Role({
    name: "Admin",
    project: project._id,
  });
  role.permissions = adminPermissions;
  await role.save(); // Maybe this could run in parallel with the project save
  userDoc.roles.push(role._id);
  project.roles.push(role._id);
  project.users.push(userDoc._id as Types.ObjectId);
  await project.save();
  return project;
};

const UserSchema = new Schema<types.IUser>({
  name: { type: String, required: true, lowercase: true },
  passwordHash: { type: String, select: false, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  currentProject: { type: Schema.Types.ObjectId, ref: "Project" },
  resetPasswordExpire: { type: String, select: false },
  resetTokenHash: { type: String, select: false },
});

// eslint-disable-next-line no-unused-vars
UserSchema.pre("save", async function (this: HydratedDocument<types.IUser>) {
  if (this._id && this.projects.length === 0) {
    const project: HydratedDocument<types.IProject> =
      await createDefaultProject(this);
    project.users.push(this._id);
    this.projects.push(project._id);
  }
  await setDefaultProjectForUserWithoutSave(this);
});
UserSchema.plugin(uniqueValidator, { type: "mongoose-unique-validator" });

export const User = model<types.IUser>("User", UserSchema);
