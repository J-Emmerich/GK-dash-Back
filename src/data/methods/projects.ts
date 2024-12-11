import { IUser, IProject, IRole } from "@commons/types";
import { HydratedDocument, Types } from "mongoose";
import { Project, Role } from "@models";

export const createProjectAndSaveUser = async (
  userDoc: HydratedDocument<IUser>,
  projectName: string,
  role: IRole,
  isPrivate: boolean
) => {
  const project: HydratedDocument<IProject> = new Project({
    name: projectName,
    isPrivate,
  });
  const newRole: HydratedDocument<IRole> = new Role({
    name: role.name,
    permissions: role.permissions,
    project: project._id,
  });

  await newRole.save(); // Role should be saved first
  userDoc.roles.push(newRole._id);
  userDoc.projects.push(project._id);
  project.roles.push(newRole._id);
  project.users.push(userDoc._id as Types.ObjectId);
  await Promise.all([project.save(), userDoc.save()]);
  return project;
};
