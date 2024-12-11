import { Schema, model } from "mongoose";
import { IAction, IPermission, IRole } from "@commons/types";

const ActionSchema = new Schema<IAction>(
  { name: { type: String, uppercase: true } },
  { _id: false }
);
const PermissionSchema = new Schema<IPermission>(
  { resource: { type: String, uppercase: true }, actions: [ActionSchema] },
  { _id: false }
);

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, lowercase: true },
  permissions: [PermissionSchema],
  project: { type: Schema.Types.ObjectId, ref: "Project" },
});

export const Role = model<IRole>("Role", RoleSchema);
