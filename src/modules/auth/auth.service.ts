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
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema.js";

import { statusCodes, Message, errorCodes } from "../../constants/response.constants.js";

import customErrors from "../../utils/exception.utils.js";

import { env } from "../../config/dotenv.config.js";

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (userId: string): string => {
  const jwtSecret = env.jwtSecret;

  if (!jwtSecret) {
    throw new Error("JWT secret is not configured");
  }

  return jwt.sign(
    { userId },
    jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] }
  );
};

export const registerUser = async (req: Request) => {
  const data = registerSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    if (existingUser.isEmailVerified) {
      throw new customErrors(
        statusCodes.conflict,
        Message.emailAlreadyRegistered,
        errorCodes.emailAlreadyRegistered
      );
    }

    const registrationExpired =
      existingUser.createdAt <= new Date(Date.now() - 60 * 60 * 1000);

    if (registrationExpired) {
      await prisma.user.delete({
        where: {
          id: existingUser.id,
        },
      });
    } else {
      const otp = generateOtp();
      const hashedOtp = await bcrypt.hash(otp, 10);

      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          name: data.name,
          password: await bcrypt.hash(data.password, 10),
          otpCode: hashedOtp,
          otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      try {
        await sendEmailOtp(otp, data.email);
      } catch (error) {
        throw error;
      }

      return {
        statusCode: statusCodes.ok,
        message: "A new OTP has been sent to your email.",
      };
    }
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
      where: {
        id: user.id,
      },
    });

    throw error;
  }

  return {
    statusCode: statusCodes.created,
    message: "Registration successful. Verify your email with OTP.",
    data: {
      email: data.email,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    },
  };
};

export const verifyEmail = async (
  req: Request,
  res: Response
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

  const token = generateToken(user.id);

  res.cookie("token", token, {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    statusCode: statusCodes.ok,
    message: "Email verified successfully",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    },
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
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    statusCode: statusCodes.ok,
    message: Message.loginSuccessfully,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  };
};

export const forgotPassword = async (req: Request) => {
  const data = forgotPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
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

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordOtp: hashedOtp,
      resetPasswordOtpExpiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    },
  });

  await sendEmailOtp(otp, user.email);

  return {
    statusCode: statusCodes.ok,
    message: "Password reset OTP has been sent to your email.",
    data: {
      email: user.email,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    },
  };
};

export const resetPassword = async (req: Request) => {
  const data = resetPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new customErrors(
      statusCodes.notFound,
      Message.userNotFound,
      errorCodes.userNotFound
    );
  }

  if (
    !user.resetPasswordOtp ||
    !user.resetPasswordOtpExpiresAt
  ) {
    throw new customErrors(
      statusCodes.badRequest,
      Message.invalidOtp,
      errorCodes.invalidOtp
    );
  }

  if (user.resetPasswordOtpExpiresAt < new Date()) {
    throw new customErrors(
      statusCodes.badRequest,
      Message.invalidOtp,
      errorCodes.invalidOtp
    );
  }

  const otpMatches = await bcrypt.compare(
    data.otp,
    user.resetPasswordOtp
  );

  if (!otpMatches) {
    throw new customErrors(
      statusCodes.badRequest,
      Message.invalidOtp,
      errorCodes.invalidOtp
    );
  }

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordOtp: null,
      resetPasswordOtpExpiresAt: null,
    },
  });

  return {
    statusCode: statusCodes.ok,
    message: "Password reset successfully.",
    data: {}
  };
};

export const logoutUser = async (
  req: Request,
  res: Response
) => {
  const token = req.cookies.token;

  if (!token) {
    throw new customErrors(
      statusCodes.notFound,
      Message.userNotFound,
      errorCodes.userNotFound
    );
  }
  res.clearCookie("token", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
  })
  return {
    statusCode: statusCodes.ok,
    message: Message.logoutSuccessfully,
    data: {
      message: "User logged out successfully",
    },
  };
};

export const getCurrentUser = async (
  req: Request,
  res: Response
) => {
  const token = req.cookies.token;

  if (!token) {
    return {
      statusCode: statusCodes.ok,
      message: "No active session",
      data: {
        user: null,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        linkedinUrl: true,
        githubUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.clearCookie("token", {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
      });
      
      return {
        statusCode: statusCodes.ok,
        message: "User not found",
        data: {
          user: null,
        },
      };
    }

    return {
      statusCode: statusCodes.ok,
      message: "User retrieved successfully",
      data: {
        user,
      },
    };
  } catch (error) {
    res.clearCookie("token", {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
    });

    return {
      statusCode: statusCodes.ok,
      message: "Invalid or expired token",
      data: {
        user: null,
      },
    };
  }
};

export const resendOtp = async (req: Request) => {
  const data = forgotPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
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

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otpCode: hashedOtp,
      otpExpiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    },
  });

  await sendEmailOtp(otp, user.email);

  return {
    statusCode: statusCodes.ok,
    message: "A new OTP has been sent to your email.",
    data: {
      email: user.email,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    },
  };
};
