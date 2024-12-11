import { NextFunction, Response, Errback  } from "express";
import { IErrback, IRequest } from "@commons/types";
import { ErrorResponse } from "@utilities";
import { MongoError } from "mongodb";
import { Error } from "mongoose";

const sendHttpResponse = (err: ErrorResponse, req: IRequest, res: Response) => {
  if (err.statusCode === 500) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  } else if (err.route === "Auth") {
    res.status(401).json({
      success: false,
      error: "Invalid credentials",
    });
  } else if (err.route === "Setting") {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Server Error",
    });
  } else
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || "Server Error",
    });
};
// Get the 4 arguments of Express Error Handling
// eslint-disable-next-line no-unused-vars
export const errorHandler = (
  err: Errback,
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
let message:string;
let status:number;

if (err instanceof MongoError) {
    if (err.code === 11000) {
       message = "Duplicate Field Error";
       status = 401;
  }
    } 
  else if (err instanceof Error.ValidationError ) {
         message = Object.values(err.errors).map((errorObject) => errorObject.message)[1];
         status = 401;
         let errorResponse = new ErrorResponse(message, status)
         sendHttpResponse(errorResponse, req, res);
        } else {
          message = "Unknown Error";
          let errorResponse = new ErrorResponse(message, 500)
    sendHttpResponse(errorResponse, req, res);
  }

};

export const logError = (err, req, res, next) => {
  next(err);
};
