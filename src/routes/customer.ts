import { IRequest } from "@commons/types";
import { authorize, context } from "@middlewares";
import { NextFunction, Response, Router } from "express";
import { Types } from "mongoose";
import { customersController } from "../controllers/customers-controller";

export const customerRouter = () => {
  const router = Router();
  const controller = customersController();

  router.param(
    "customerId",
    async (req: IRequest, res: Response, next: NextFunction) => {
      const customerId = new Types.ObjectId(req.params.customerId);
      req.context.customerId = customerId;
      next();
    }
  );

  router.all("*", context, authorize);

  router.get("/", controller.getAllCustomersFromAProject);
  router.get("/:customerId", controller.getOneCustomer);
  router.post("/", controller.createCustomer);
  router.put("/:customerId", controller.editCustomer);
  router.delete("/:customerId", controller.deleteCustomer);
  return router;
};
