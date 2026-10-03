import { Request, Response } from "express";

// bcrypt does not ship TypeScript declarations in this project.
// @ts-expect-error The dependency is used through its JavaScript API.
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import { prisma } from "../../config/database.config.js";
import { sendEmailOtp } from "../../utils/email.utils.js";

import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
} from "./auth.schema.js";

import { statusCodes, Message, errorCodes } from "../../constants/response.constants.js";

import customErrors from "../../utils/exception.utils.js";

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
};

export const registerUser = async (
  req: Request,
  _res: Response
) => {
  const data = registerSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
if (existingUser) {
    throw new customErrors(
      statusCodes.conflict,
      Message.emailAlreadyRegistered,
      errorCodes.emailAlreadyRegistered
    );
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      otpCode: hashedOtp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  try {
    await sendEmailOtp(otp, data.email);
  } catch (error) {
    await prisma.user.delete({
      where: { id: user.id },
    });
    throw error;
  }

  return {
    message: "Registration successful. Verify your email with OTP.",
    userId: user.id,
  };
};

export const verifyEmail = async (
  req: Request,
  _res: Response
) => {
  const data = verifyOtpSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if(!user) {
    throw new customErrors(
      statusCodes.notFound,
      Message.userNotFound,
      errorCodes.userNotFound
    );
  }

  if (user.isEmailVerified) {
    throw new customErrors(
      statusCodes.conflict,
      Message.emailVerified,
      errorCodes.emailAlreadyRegistered
    );
  }

  const otpMatches = user.otpCode
    ? await bcrypt.compare(data.otp, user.otpCode)
    : false;

  if (
    !otpMatches ||
    !user.otpExpiresAt ||
    user.otpExpiresAt < new Date()
  ) {
    throw new customErrors(
      statusCodes.badRequest,
      Message.invalidOtp,
      errorCodes.invalidOtp
    );
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isEmailVerified: true,
      otpCode: null,
      otpExpiresAt: null,
    },
  });

  return {
    message: "Email verified successfully",
  };
};

export const loginUser = async (
  req: Request,
  res: Response
) => {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new customErrors(
      statusCodes.notFound,
      Message.userNotFound,
      errorCodes.userNotFound
    );
  }

  if (!user.isEmailVerified) {
    throw new customErrors(
      statusCodes.unauthorized,
      Message.emailNotVerified,
      errorCodes.emailNotVerified
    );
  }

  const passwordMatch = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!passwordMatch) {
    throw new customErrors(
      statusCodes.unauthorized,
      Message.invalidCredentials,
      errorCodes.invalidCredentials
    );
  }

  const token = generateToken(user.id);

  res.cookie("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

return {
  message: Message.loginSuccessfully,
  data: {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  },
};
};

export const logoutUser = async (
  _req: Request,
  _res: Response
) => {
  return {
    message: "Logout successful",
  };
};