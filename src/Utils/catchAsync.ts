import { Request, Response, NextFunction } from "express";
const catchAsync = (myFn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    myFn(req, res, next).catch((error: any) => next(error));
  };
};

export default catchAsync;
