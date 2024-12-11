import { IRequest } from "@commons/types";
import { authorize, context } from "@middlewares";
import { NextFunction, Response, Router } from "express";
import { Types } from "mongoose";

import { invoiceController } from "../controllers/invoice-controller";

export const invoiceRouter = () => {
  const router = Router();
  const controller = invoiceController();

  router.param(
    "invoiceId",
    async (req: IRequest, res: Response, next: NextFunction) => {
      const invoiceId = new Types.ObjectId(req.params.invoiceId);
      req.context.invoiceId = invoiceId;
      next();
    }
  );
  router.param(
    "customerId",
    async (req: IRequest, res: Response, next: NextFunction) => {
      const customerId = new Types.ObjectId(req.params.customerId);
      req.context.customerId = customerId;
      next();
    }
  );

  router.all("*", context, authorize);

  router.get("/", controller.fetchAllInvoices);
  router.get("/:invoiceId", controller.fetchInvoice);
  router.put("/:invoiceId", controller.editInvoice);
  router.post("/", controller.createInvoice);
  router.delete("/:invoiceId", controller.deleteInvoice);
  router.get("/download/:invoiceId", controller.fetchInvoicePdf);
  router.put("/:invoiceId/owner/:customerId", controller.editOwnerOfInvoice);


  return router;
};
