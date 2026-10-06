import {Request, Response} from 'express';
import * as userService from './user.service.js';
import { statusCodes, Message, errorCodes } from '../../constants/response.constants.js';

export const getMyProfile = async (req: Request, res: Response) => {
    const result = await userService.getMyProfile(req);
    return successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
    );
};

export const updateMyProfile = async (req: Request, res: Response) => {
    const result = await userService.updateMyProfile(req);
    return successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
    )
};

export const deleteMyAccount = async (req: Request, res: Response) => {
    const result = await userService.deleteMyAccount(req);
    return successResponse(
        res,
        result.statusCode,
        result.message,
        result.data
    )
}

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

