import { NextFunction, Response } from "express";
import { User } from "@models";
import { IProject, IRequest, IUser } from "@commons/types";
import { setDefaultProjectForUser } from "@utilities";
import { HydratedDocument, Types } from "mongoose";

const jwt = require("jsonwebtoken");

export const authenticate = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization)
      return res.status(401).send("Not authorized, missing header");

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
      complete: true,
    });
    let id = decodedToken.payload.user;
    id = new Types.ObjectId(id);

    const user = await User.findById(id).populate("currentProject");
    if (user) {
      req.context.token = token;
      req.context.user = user;
      if (!user.currentProject?._id) await setDefaultProjectForUser(user);
      req.context.currentProject =
        user.currentProject as HydratedDocument<IProject>;
      next();
    } else {
      throw new Error("No user");
    }
  } catch (error) {
    error.route = "Auth";
    next(error);
  }
};
