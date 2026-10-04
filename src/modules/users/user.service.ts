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
      updatedAt: true,
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
      updatedAt: true,
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
  };
};