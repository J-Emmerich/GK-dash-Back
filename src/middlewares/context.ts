import { Response, NextFunction } from "express";
import { IRequest, IRole, IPermission } from "@commons/types";
import { EResource } from "@commons/enumerators";
let contextPermission;
export const context = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  // Trim the /api/ part of the base url and convert to uppercase
  const indexOfLastPath = req.baseUrl.lastIndexOf("/") + 1;
  let resource = req.baseUrl.substring(indexOfLastPath).toUpperCase();
  let filteredRolesFromContext: IRole[] | [];
  // If exist in the list of resources save in the context, otherwise close connection
  if (EResource.has(resource)) {
    req.context.resourceName = resource;

    // Define the Available roles in the project
    req.context.currentProject = await req.context.currentProject!.populate({
      path: "roles",
    });
    req.context.availableRoles = req.context.currentProject.roles as IRole[];

    if (req.context.availableRoles.length < 1)
      return res.status(404).send("Role not available");
    //filterRoles That have the same resource as the route being used and return that permission
    filteredRolesFromContext = req.context.availableRoles.filter(
      (role: IRole) => {
        contextPermission = role.permissions.find(
          (permission: IPermission) =>
            permission.resource.toUpperCase() === req.context.resourceName
        );

        if (contextPermission !== undefined) {
          role.permissions = [contextPermission];
          return role;
        }
      }
    );
  } else return res.status(404).send("Resource not found");

  if (filteredRolesFromContext.length < 1)
    return res.status(404).send("Resource not available in roles");
  req.context.availableRoles = filteredRolesFromContext;
  next();
};
