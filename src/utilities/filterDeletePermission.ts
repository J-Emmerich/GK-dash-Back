
import { IRole, IPermission, EPermision } from "@commons/types";

export const filterDeletePermission = (role : IRole) : IRole | void => {


    if (role.permissions.some((permission:IPermission )=> permission.name.toUpperCase() === EPermision.delete)){
        return role
    }
}