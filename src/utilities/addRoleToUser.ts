import { Role, User } from "@models";
import { Types } from "mongoose";

export const addRoleToUser = async (roleId: string) => {
  const _roleId = new Types.ObjectId(roleId);
  const user = new User({ name: "Silence", role: [_roleId] });
  await user.save();
};
