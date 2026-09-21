import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import CustomError from "../utils/exception.utils.js";
import {
  statusCodes,
  Message,
  errorCodes,
} from "../constants/response.constants.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Zod validation error
  if (error instanceof z.ZodError) {
    return res.status(statusCodes.badRequest).json({
      success: false,
      message: Message.invalidInput,
      errorCode: errorCodes.invalidInput,
      errors: error.issues,
      data: null,
    });
  }

  // Our custom application error
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode,
      errors: error.errors,
      data: null,
    });
  }

  // Unexpected error
  console.error(error);

  return res.status(statusCodes.internalServerError).json({
    success: false,
    message: Message.serverError,
    errorCode: errorCodes.serverError,
    errors: [],
    data: null,
  });
};