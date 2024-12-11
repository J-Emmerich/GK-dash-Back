import * as express from "express";
import { authenticationController } from "../controllers/authenticationController";

export const authenticationRouter = () => {
  const router = express.Router();
  const controller = authenticationController();

  router.get("/login", controller.login);
  router.post("/register", controller.register);
  router.post("/forgotpassword", controller.forgotPassword);
  router.put("/resetpassword/:resetToken", controller.resetPassword);

  return router;
};
