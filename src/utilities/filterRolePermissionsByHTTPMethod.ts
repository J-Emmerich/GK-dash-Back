import { IRole, IAction } from "@commons/types";

export const filterRolePermissionsByHTTPMethod = (
  role: IRole,
  method: string
): IRole | null => {
  // PLEASE update this
  if (method === "GET") method = "READ";
  if (method === "PUT") method = "UPDATE";
  if (method === "POST") method = "CREATE";

  // I assume that each role come here with 1 permission
  if (
    role.permissions[0].actions.some(
      (action: IAction) => action.name.toUpperCase() === method.toUpperCase()
    )
  ) {
    return role;
  } else return null;
};
