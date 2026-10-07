import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/dotenv.config.js";
import { errorCodes, Message, statusCodes } from "../constants/response.constants.js";
import CustomError from "../utils/exception.utils.js";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorization = req.get("authorization");
  const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const token = bearerToken ?? req.cookies?.token;

  if (!token) {
    throw new CustomError(
      statusCodes.unauthorized,
      Message.invalidCredentials,
      errorCodes.unauthorized
    );
  }

  let payload: string | jwt.JwtPayload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new CustomError(
        statusCodes.unauthorized,
        Message.invalidCredentials,
        errorCodes.unauthorized
      );
    }

    throw error;
  }

  if (typeof payload === "string" || typeof payload.userId !== "string") {
    throw new CustomError(
      statusCodes.unauthorized,
      Message.invalidCredentials,
      errorCodes.unauthorized
    );
  }

  req.user = { ...payload, userId: payload.userId };
  next();
};