import { IRequest } from "@commons/types";
import { Customer } from "@models";
import { NextFunction, Response } from "express";
import { Types } from "mongoose";

export const customersController = () => {
  async function getAllCustomersFromAProject(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const customers = await Customer.find({
        project: req.context.currentProject._id,
      });
      if (customers.length < 1)
        return res
          .status(404)
          .json({ success: false, data: "no customer found" });

      return res.status(200).json({ success: true, data: customers });
    } catch (err) {
      next(err);
    }
  }
  async function getOneCustomer(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const customerId = new Types.ObjectId(req.params.customerId);
      const customer = await Customer.findById(customerId);
      if (!customer)
        return res.status(404).json({ success: false, data: "no customer" });
      return res.status(200).json({ success: true, data: customer });
    } catch (error) {
      next(error);
    }
  }
  async function createCustomer(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      // need to validate request
      const customer = req.body;
      customer.project = req.context.currentProject._id;
      const newCustomer = new Customer(customer);
      await newCustomer.save();

      res.status(201).json({ success: true, data: newCustomer });
    } catch (err) {
      next(err);
    }
  }
  async function deleteCustomer(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await Customer.deleteOne({ _id: req.context.customerId });
      res.status(200).json({ success: true, data: "User deleted" });
    } catch (err) {
      next(err);
    }
  }

  async function editCustomer(
    req: IRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const newCustomer = req.body;
      const editedCustomer = await Customer.findOneAndUpdate(
        { _id: req.context.customerId },
        newCustomer,
        { new: true }
      );

      res.status(200).json({ success: true, data: editedCustomer });
    } catch (err) {
      next(err);
    }
  }

  return {
    getOneCustomer,
    getAllCustomersFromAProject,
    createCustomer,
    deleteCustomer,
    editCustomer,
  };
};
