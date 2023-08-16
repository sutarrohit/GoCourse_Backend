import { Request, Response, NextFunction } from "express";
import AppError from "../Utils/appError";

// const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
//   // console.log(err.stack);
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   if (process.env.NODE_ENV === "development") {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//       error: err,
//       stack: err.stack,
//     });
//   } else if (process.env.NODE_ENV === "production") {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   }

//   next();
// };

const handleCastError = (err: any) => {
  let message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 404);
};

const sendErrorDev = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorPro = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "CastError") err = handleCastError(err);

  if (err.isOprational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Somthing went very wrong",
    });
  }
};

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res, next);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorPro(err, req, res, next);
  }
  next();
};

export default globalErrorHandler;
