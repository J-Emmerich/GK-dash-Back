import { IProject, IRequest } from "@commons/types";
import { User } from "@models";
import { NextFunction, Response } from "express";

export const userController = () => {
  const updateCurrentProject = async (
    req: IRequest,
    res: Response,
    // eslint-disable-next-line no-unused-vars
    next: NextFunction
  ) => {
    const { projectName, isDefault } = req.body;

    if (!projectName && !isDefault)
      return res
        .status(401)
        .json({ success: false, description: "Bad Request" });
    // verify that the user has the project
    if (!req.context.user!.populated("projects"))
      await req.context.user?.populate("projects");

    let project;
    if (isDefault) {
      project = req.context.user?.projects.find(
        (projectFromContext: IProject) => projectFromContext.isDefault === true
      );
    } else {
      project = req.context.user?.projects.find(
        (projectFromContext: IProject) =>
          projectFromContext.name === projectName
      );
    }
    if (!project)
      return res
        .status(401)
        .json({ success: false, description: "User dont have this project" });
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.context.user!._id },
      { currentProject: project._id },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      description: "current project changed",
      updated: updatedUser?.currentProject,
    });
  };

  return { updateCurrentProject };
};
