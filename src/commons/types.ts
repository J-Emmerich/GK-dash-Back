import { Errback, Request } from "express";
import { MongoError } from "mongodb";
import { Error, HydratedDocument, MongooseError, Types } from "mongoose";

export interface IProject {
  _id?: Types.ObjectId;
  name: string;
  users: Array<IUser | Types.ObjectId>;
  roles: Array<IRole | Types.ObjectId>;
  isPrivate?: Boolean;
  isDefault?: Boolean;
}

export interface IPermission {
  actions: Array<IAction>;
  resource: string;
}

export interface IAction {
  name: string;
}

export interface IRole {
  _id?: Types.ObjectId;
  name: string;
  permissions: Array<IPermission>;
  project?: Types.ObjectId;
}

export interface IUser {
  _id?: Types.ObjectId;
  passwordHash?: string;
  currentProject?: Types.ObjectId | IProject | HydratedDocument<IProject>;
  email: string;
  name: string;
  roles: Array<Types.ObjectId | IRole>;
  projects: Array<Types.ObjectId | IProject>;
  resetPasswordExpire?: string;
  resetTokenHash?: string;
}

export interface IRequest extends Request {
  context: {
    projectId?: Types.ObjectId;
    user?: HydratedDocument<IUser>;
    resourceName?: string;
    availableRoles?: IRole[];
    token?: string;
    currentProject?: HydratedDocument<IProject>;
    secondaryUserId?: Types.ObjectId;
    customerId?: Types.ObjectId;
    invoiceId?: Types.ObjectId;
  };
}

export interface IErrback extends Errback, Error {
}