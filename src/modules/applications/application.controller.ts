
import { Request, Response } from "express";
import * as applicationServices from "./application.service.js";
// import { successResponse } from "../../utils/response.utils.js";

export const createApplication = async (
  req: Request,
  res: Response
) => {
  const result = await applicationServices.createApplication(req);
  return successResponse(res, result.statusCode, result.message, result.data);
};

export const getApplications = async (
  req: Request,
  res: Response
) => {
  const result = await applicationServices.getApplications(req);
  return successResponse(res, result.statusCode, result.message, result.data);
};

export const getApplicationById = async (
  req: Request,
  res: Response
) => {
  const result = await applicationServices.getApplicationById(req);
  return successResponse(res, result.statusCode, result.message, result.data);
};

export const updateApplication = async (
  req: Request,
  res: Response
) => {
  const result = await applicationServices.updateApplication(req);
  return successResponse(res, result.statusCode, result.message, result.data);
};

export const deleteApplication = async (
  req: Request,
  res: Response
) => {
  const result = await applicationServices.deleteApplication(req);
  return successResponse(res, result.statusCode, result.message, result.data);
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response
) => {
  const result = await applicationServices.updateApplicationStatus(req);
  return successResponse(res, result.statusCode, result.message, result.data);
};

export const addNote = async (
  req: Request,
  res: Response
) => {
  const result = await applicationServices.addNote(req);
  return successResponse(res, result.statusCode, result.message, result.data);
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
