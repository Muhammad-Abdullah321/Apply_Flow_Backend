class CustomError extends Error {
  statusCode: number;
  data: unknown;
  errorCode: string;
  errors: unknown[];
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errorCode: string = "UNKNOWN_ERROR", // Fixed typo: UNKNWON_ERROR -> UNKNOWN_ERROR
    errors: unknown[] = [],
    isOperational: boolean = true,
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.errorCode = errorCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default CustomError;