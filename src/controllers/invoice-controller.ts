import { join } from "path";
import { Customer, Invoice } from "@models";
import { IRequest } from "@commons/types";
import { NextFunction, Response } from "express";
import {
  saveToPdf,
  dayjsFormat,
  validateInvoiceOwnerUniqueness,
} from "@utilities";

const root = join(__dirname, "../../client/output");

export const invoiceController = () => {
  async function fetchInvoice(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log(req.context.invoiceId);
      const invoice = await Invoice.findById(req.context.invoiceId);
      if (!invoice) throw Error("Nothing found");
      res.status(200).json({ success: true, data: invoice });
    } catch (err) {
      next(err);
    }
  }

  async function fetchAllInvoices(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const invoices = await Invoice.find({
        project: req.context.currentProject._id,
      });
      res.status(200).json({ success: true, data: invoices });
    } catch (err) {
      next(err);
    }
  }

  async function createInvoice(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const invoice = req.body;
      const date = dayjsFormat(invoice.invoiceDate);
      invoice.invoiceDate = date;
      invoice.project = req.context.currentProject._id;
      const newInvoice = new Invoice(invoice);
      await newInvoice.save();
      res.status(201).json({ success: true, data: newInvoice });
    } catch (err) {
      next(err);
    }
  }
  async function editInvoice(req: IRequest, res: Response, next: NextFunction) {
    try {
      const newInvoice = req.body;

      const editedInvoice = await Invoice.findOneAndUpdate(
        { _id: req.context.invoiceId },
        newInvoice,
        { new: true }
      );
      res.status(200).json({ success: true, data: editedInvoice });
    } catch (err) {
      next(err);
    }
  }

  async function deleteInvoice(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await Invoice.deleteOne(
        { _id: req.context.invoiceId },
        {}
      );
      if (result.deletedCount === 0)
        return res
          .status(404)
          .json({ success: false, data: { message: "document not found" } });
      res.status(200).json({ success: true, data: {message: "deleted"} });
    } catch (err) {
      next(err);
    }
  }

  async function fetchInvoicePdf(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const invoice = await Invoice.findById(req.context.invoiceId);
      // this is one functionality
      await saveToPdf(invoice._id, invoice.invoiceNumber, req.context.token); // File System
      // this is another functionality
      res.download(`${root}/${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      next(err);
    }
  }

  async function editOwnerOfInvoice(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const owner = await Customer.findById(req.context.customerId);
      if (!owner) throw Error("No customer");
      let invoice = await Invoice.findById(req.context.invoiceId);
      if (!invoice) throw new Error("No invoice");
      // Check that the owner is not already in the array
      if (invoice?.invoiceOwners.length) {
        invoice.invoiceOwners = validateInvoiceOwnerUniqueness(
          invoice.invoiceOwners
        );
      } else {
        invoice.invoiceOwners.push(owner._id);
      }
      invoice = await invoice.save();
      res.status(200).json({ success: true, data: { invoice } });
    } catch (error) {
      next(error);
    }
  }
  return {
    editOwnerOfInvoice,
    fetchAllInvoices,
    fetchInvoice,
    createInvoice,
    editInvoice,
    deleteInvoice,
    fetchInvoicePdf,
  };
};
