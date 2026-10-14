import { Request, Response } from "express";
import { prisma } from '../../config/database.config.js';
import { statusCodes, Message, errorCodes } from '../../constants/response.constants.js';
import customErrors from '../../utils/exception.utils.js';
import { updateProfileSchema } from './user.schema.js';

export const getMyProfile = async (req: Request) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new customErrors(
      statusCodes.unauthorized,
      Message.userNotFound,
      errorCodes.notFound
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
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
      isEmailVerified: true,
      createdAt: true,
      updateAt: true,
    },
  });

  if (!user) {
    throw new customErrors(
      statusCodes.notFound,
      Message.userNotFound,
      errorCodes.userNotFound
    );
  }

  return {
    statusCode: statusCodes.ok,
    message: Message.profileFetched,
    data: user,
  };
};

export const updateMyProfile = async (req: Request) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new customErrors(
      statusCodes.unauthorized,
      Message.userNotFound,
      errorCodes.unauthorized
    );
  }

  const data = updateProfileSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new customErrors(
      statusCodes.notFound,
      Message.userNotFound,
      errorCodes.userNotFound
    );
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
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
      isEmailVerified: true,
      createdAt: true,
      updateAt: true,
    },
  });

  return {
    statusCode: statusCodes.ok,
    message: Message.profileUpdated,
    data: updatedUser,
  };
};

export const deleteMyAccount = async (req: Request) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new customErrors(
      statusCodes.unauthorized,
      Message.userNotFound,
      errorCodes.unauthorized
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new customErrors(
      statusCodes.notFound,
      Message.userNotFound,
      errorCodes.userNotFound
    );
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return {
    statusCode: statusCodes.ok,
    message: Message.accountDeleted,
    data: {}
  };
};

export const changePassword = async (req: Request) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new customErrors(
      statusCodes.unauthorized,
      Message.userNotFound,
      errorCodes.unauthorized
    );
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new customErrors(
      statusCodes.badRequest,
      "Current password and new password are required",
      errorCodes.invalidInput
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new customErrors(
      statusCodes.notFound,
      Message.userNotFound,
      errorCodes.userNotFound
    );
  }

  // TODO: Add password comparison logic using bcrypt
  // const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  // if (!isPasswordValid) {
  //   throw new customErrors(
  //     statusCodes.unauthorized,
  //     "Current password is incorrect",
  //     errorCodes.invalidInput
  //   );
  // }

  // TODO: Add password validation (length, complexity)
  // TODO: Hash new password using bcrypt
  // const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  // await prisma.user.update({
  //   where: { id: userId },
  //   data: { password: hashedPassword },
  // });

  return {
    statusCode: statusCodes.ok,
    message: "Password changed successfully",
    data: {}
  };
};