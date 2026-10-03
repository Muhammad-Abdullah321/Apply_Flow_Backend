import { Request, Response } from "express";
import * as authServices from "./auth.service.js";
import { statusCodes,Message,errorCodes } from "../../constants/response.constants.js";

export const register = async (req: Request, res: Response) => {
  const result = await authServices.registerUser(req, res);

  return successResponse(
    res,
    result.statusCode,
    result.message,
    result.data
  );
};

export const verifyOtp = async (req: Request, res: Response) => {
  const result = await authServices.verifyEmail(req, res);

  return successResponse(
    res,
    "statusCode" in result && typeof result.statusCode === "number" ? result.statusCode : statusCodes.ok,
    result.message,
    "data" in result ? result.data : undefined
  );
};

export const login = async (req: Request, res: Response) => {
  const result = await authServices.loginUser(req, res);

  return successResponse(
    res,
    result.statusCode,
    result.message,
    result.data
  );
};

export const logout = async (req: Request, res: Response) => {
  const result = await authServices.logoutUser(req, res);

  return successResponse(
    res,
    result.statusCode,
    result.message,
    result.data
    
  );
};

function successResponse(
  res: Response<any, Record<string, any>>,
  statusCode: number,
  message: string,
  data?: unknown
) {
  return res.status(statusCode).json({
    message,
    ...(data !== undefined ? { data } : {}),
  });
}
