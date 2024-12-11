import { NextFunction, Response } from "express";
import { IRequest } from "@commons/types";
import {
  loginUser,
  registerUser,
  resetUserPassword,
  userForgotPassword,
} from "@dbmethods/authentication";

export const authenticationController = () => {
  const login = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const { name, password } = req.body;
      const user = await loginUser(name, password);
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  };

  const register = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const { name, password, email } = req.body;
      const user = await registerUser(name, password, email);
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  };
  const forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      await userForgotPassword(email);
      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (err) {
      next(err);
    }
  };

  const resetPassword = async (req, res, next) => {
    try {
      const { resetToken } = req.params;
      const { password } = req.body;
      await resetUserPassword(resetToken, password);
      res.status(200).json({
        succes: true,
        data: "Password reset",
      });
    } catch (err) {
      next(err);
    }
  };

  return { login, register, forgotPassword, resetPassword };
};
