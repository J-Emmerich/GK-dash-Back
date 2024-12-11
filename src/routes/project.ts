import * as express from "express";
import { authorize, context } from "@middlewares";
import { Types } from "mongoose";
import { IRequest } from "@commons/types";
import { projectController } from "../controllers/projectController";

export const projectRouter = () => {
  const router = express.Router();
  const controller = projectController();

  router.param("projectId", async (req: IRequest, res, next) => {
    try {
      const projectId = new Types.ObjectId(req.params.projectId);
      req.context.projectId = projectId;
      next();
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, description: "Bad format of id" });
    }
  });
  router.param("secondaryUserId", async (req: IRequest, res, next) => {
    const secondaryUserId = new Types.ObjectId(req.params.secondaryUserId);
    req.context.secondaryUserId = secondaryUserId;
    next();
  });

  router.all("*", context, authorize);
  // If project Id is not defined its assumed that the current project should be updated

  // Get all projects from user
  router.get("/", controller.getAllProjectsFromUser);
  // Edit project details
  router.put("/", controller.editProjectDetails);
  router.get("/current", controller.getCurrentProject);
  // Get role from defined project
  router.get("/:projectId?/role", controller.getRoleDetails);
  router.post("/:projectId?/role", controller.createRole);
  router.put(
    "/:projectId?/user/:secondaryUserId?/role",
    controller.updateUserRole
  );

  // Get specific project from user
  router.get("/:projectId", controller.getOneProject);
  // Add a project
  router.post("/", controller.createNewProject);
  // Add an user to a project
  router.post(
    "/:projectId/user/:secondaryUserId",
    controller.addUserToOneProject
  );
  // router.put("/:projectId/user/:secondaryUserId", controller.updateUserRole);
  router.delete("/:projectId", controller.deleteProject);
  router.delete(
    "/:projectId/user/:secondaryUserId",
    controller.removeUserFromProject
  );

  /* 




  router.delete("/:projectId", controller.deleteOneProject);
*/
  return router;
};
