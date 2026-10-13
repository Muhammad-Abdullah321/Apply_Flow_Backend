import { Request, Response } from "express";
import * as authServices from "./auth.service.js";
import { statusCodes,Message,errorCodes } from "../../constants/response.constants.js";

export const register = async (req: Request, res: Response) => {
  const result = await authServices.registerUser(req);

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
    result.statusCode,
    result.message,
    result.data
  );
};

export const resendOtp = async (req: Request, res: Response) => {
  const result = await authServices.resendOtp(req);

  return successResponse(
    res,
    result.statusCode,
    result.message,
    result.data
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

export const me = async (req: Request, res: Response) => {
  const result = await authServices.getCurrentUser(req, res);

  return successResponse(
    res,
    result.statusCode,
    result.message,
    result.data
  );
};

export const forgotPassword = async (req: Request, res: Response) => {
  const result = await authServices.forgotPassword(req);

  return successResponse(
    res,
    result.statusCode,
    result.message,
    result.data
  );
};

export const resetPassword = async (req: Request, res: Response) => {
  const result = await authServices.resetPassword(req);

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
