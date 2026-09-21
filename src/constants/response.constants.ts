export const statusCodes = Object.freeze({
  ok: 200,
  created: 201,
  accepted: 202,
  noContent: 204,

  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  methodNotAllowed: 405,
  conflict: 409,

  internalServerError: 500,
  notImplemented: 501,
  badGateway: 502,
  serviceUnavailable: 503,
});

export const Message = Object.freeze({
  registerSuccessfully: "Successfully Registered",
  loginSuccessfully: "Login Successfully",
  logoutSuccessfully: "Logout Successfully",

  alreadyExist: "Already Exist",
  emailAlreadyRegistered: "Email Already Registered",

  invalidCredentials: "Invalid Credentials",
  invalidOtp: "Invalid or Expired OTP",

  emailNotVerified: "Email Not Verified",
  emailVerified: "Email Verified Successfully",

  userNotFound: "User Not Found",
  notRegistered: "User Not Registered",

  missingField: "Missing Required Fields",
  invalidInput: "Invalid Input",
  invalidEmail: "Invalid Email",

  wrongPassword: "Wrong Password",

  serverError: "Internal Server Error",
});

export const errorCodes = Object.freeze({
  badRequest: "BAD_REQUEST",
  invalidInput: "INVALID_INPUT",

  unauthorized: "UNAUTHORIZED",
  forbidden: "FORBIDDEN",

  notFound: "NOT_FOUND",
  conflict: "CONFLICT",

  invalidCredentials: "INVALID_CREDENTIALS",
  emailAlreadyRegistered: "EMAIL_ALREADY_REGISTERED",
  emailNotVerified: "EMAIL_NOT_VERIFIED",

  invalidOtp: "INVALID_OTP",
  expiredOtp: "EXPIRED_OTP",

  userNotFound: "USER_NOT_FOUND",

  databaseError: "DATABASE_ERROR",
  serverError: "SERVER_ERROR",
});