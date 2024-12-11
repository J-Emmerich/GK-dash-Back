import { HydratedDocument } from "mongoose";
import { IPermission, IRole } from "@commons/types";

import { Role } from "@models";

// Create the roles and permissions in the database

export const adminPermissions: IPermission[] = [
  {
    resource: "Invoice",
    actions: [
      { name: "CREATE" },
      { name: "READ" },
      { name: "UPDATE" },
      { name: "DELETE" },
    ],
  },
  {
    resource: "Customer",
    actions: [
      { name: "CREATE" },
      { name: "READ" },
      { name: "UPDATE" },
      { name: "DELETE" },
    ],
  },
  {
    resource: "User",
    actions: [
      { name: "CREATE" },
      { name: "READ" },
      { name: "UPDATE" },
      { name: "DELETE" },
    ],
  },
  {
    resource: "Project",
    actions: [
      { name: "CREATE" },
      { name: "READ" },
      { name: "UPDATE" },
      { name: "DELETE" },
    ],
  },
];

const userPermissions: IPermission[] = [
  {
    resource: "Invoice",
    actions: [{ name: "CREATE" }, { name: "READ" }, { name: "UPDATE" }],
  },
  {
    resource: "Client",
    actions: [{ name: "CREATE" }, { name: "READ" }, { name: "UPDATE" }],
  },
  {
    resource: "User",
    actions: [{ name: "CREATE" }, { name: "READ" }, { name: "UPDATE" }],
  },
  {
    resource: "Project",
    actions: [{ name: "CREATE" }, { name: "READ" }, { name: "UPDATE" }],
  },
];

export const roles: IRole[] = [
  { name: "Admin", permissions: adminPermissions },
  { name: "User", permissions: userPermissions },
];

const findRoleAndSave: Function = async (role: IRole) => {
  const newRole: HydratedDocument<IRole> = new Role({
    name: role.name,
    permissions: role.permissions,
  });

  await newRole.save();
};

// export const createRolesAndPermissionsAndResources = async () => {
//   try {

//     for (const role of roles) {
//       const existingRole: HydratedDocument<IRole> | null = await Role.findOne({
//         name: role.name,
//       });

//       if (!existingRole) {
//         findRoleAndSave(role);
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
