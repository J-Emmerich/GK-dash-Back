import { IUser, IRole } from "@commons/types";
import { Role, User } from "@models";

//needed to access the mongoose methods
import { HydratedDocument, Types } from "mongoose";

export const createUser: Function = async (
  name: string
): Promise<IUser | null> => {
  try {
    const newUser: HydratedDocument<IUser> = await User.create({ name: name });
    await newUser.save();
    return newUser;
  } catch (error) {
    return null;
  }
};

export const findUserByName: Function = async (
  name: string
): Promise<IUser | undefined> => {
  try {
    const foundUser: IUser | null = await User.findOne({ name: name });
    if (foundUser) {
      return foundUser;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const assignToUserByIdRoleByName = async (
  userId: Types.ObjectId,
  roleId: string
): Promise<IRole | null> => {
  const role: HydratedDocument<IRole> | null = await Role.findOne({
    name: roleId,
  });
  if (role) {
    const user: HydratedDocument<IUser> | null = await User.findById(userId);
    if (user) {
      user.roles.push(role._id as unknown as IRole);
      await user.save();
    }
    return role;
  } else {
    return null;
  }
};
