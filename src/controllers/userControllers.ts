import express, { Router, Request, Response, NextFunction } from "express";
import { User } from "../model/userModel";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";

// Functions
export const userdata = catchAsync(async (_req: Request, res: Response) => {
  const user = await User.find();
  res.status(200).json({
    status: "success",
    data: user,
  });
});

// Update User data
export const updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Create error if user want to update password
  if (req.body.password || req.body.passwordConfirm) throw new AppError("This route is not for password update", 402);

  const { name, email, photo } = req.body;

  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    { name: name, email: email, photo: photo },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      user: updateUser,
    },
  });
});

// Delete User account
export const deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(200).json({
    status: "success",
    message: "User account deleted.",
  });
});
