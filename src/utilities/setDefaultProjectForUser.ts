import { Types, HydratedDocument } from "mongoose";
import { IProject, IUser } from "@commons/types";

export const setDefaultProjectForUser = async (
  user: HydratedDocument<IUser>,
  project?: Types.ObjectId
) => {
  let projectId;
  // Use default project if none is defined
  if (!project) {
    let populatedUser: HydratedDocument<IUser> = await user.populate(
      "projects"
    );

    projectId = populatedUser.projects.find(
      (project: IProject) => project.name === populatedUser._id.toString()
    );
    // If finds a default project with the user id as same then sets the id. Otherwise use the first found
    if (projectId) projectId = projectId?._id;
    if (!projectId) projectId = populatedUser.projects[0]._id;
  } else projectId = project;

  // save as the current project
  user.currentProject = projectId;
  await user.save();
};

export const setDefaultProjectForUserWithoutSave = async (
  user: HydratedDocument<IUser>,
  project?: Types.ObjectId
) => {
  let projectId;
  // Use default project if none is defined
  if (!project) {
    let populatedUser: HydratedDocument<IUser> = await user.populate(
      "projects"
    );
    projectId = populatedUser.projects.find(
      (project: IProject) => project.name === populatedUser._id.toString()
    );
    // If finds a default project with the user id as same then sets the id. Otherwise use the first found
    if (projectId) projectId = projectId?._id;
    if (!projectId) projectId = populatedUser.projects[0]._id;
  } else projectId = project;

  // save as the current project
  user.currentProject = projectId;
};
