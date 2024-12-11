import * as express from "express";
import { authorize, context } from "@middlewares";
import { userController } from "../controllers/userController";

export const userRouter = () => {
  const router = express.Router();
  const controller = userController();

  router.all("*", context, authorize);
  router.put("/current", controller.updateCurrentProject);

  return router;
};
