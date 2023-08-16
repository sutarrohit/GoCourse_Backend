import express, { Express, Request, Response, NextFunction } from "express";
import { User } from "../model/userModel";
import { signToken, login, forgetPassword, updatePassword, resetPassowrd } from "../controllers/authControllers";
import { updateMe } from "../controllers/userControllers";
import catchAsync from "../Utils/catchAsync";
import AppError from "../Utils/appError";

// Get Admin info
export const getAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const admin = await User.findOne({ role: "admin" });
  if (!admin) throw new AppError("There is no admin", 404);
  res.json({
    status: "success",
    message: admin,
  });
});

// Admin Signup
export const adminSignup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const admin = await User.findOne({ role: "admin" });

  if (admin) throw new AppError("Admin already present", 401);

  const newAdmin = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: "admin",
  });

  const jwtToken = await signToken(newAdmin._id);

  res.status(200).json({
    status: "success",
    message: "Admin created successfully",
    user: newAdmin,
    token: jwtToken,
  });
});

// Admin Login
export const adminLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const admin = await User.findOne({ email: req.body.email });
  if (!admin || admin.role !== "admin") throw new AppError("Your are unathoriazed to access admin routes", 401);
  login(req, res, next);
});

// Admin Forgot Password
export const adminForgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const admin = await User.findOne({ email: req.body.email });
  if (!admin || admin.role !== "admin") throw new AppError("Your are unathoriazed to access admin routes", 401);
  forgetPassword(req, res, next);
});

// Admin Reset Password
export const adminResetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  resetPassowrd(req, res, next);
});

// Admin Forgot Password
export const adminUpdatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  updatePassword(req, res, next);
});

// Admin Update data
export const updateAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  updateMe(req, res, next);
});

// Delete Admin
export const deleteAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const admin = await User.findByIdAndDelete(req.user._id);

  if (!admin) throw new AppError("Unable to delete admin", 404);

  res.status(200).json({
    status: "success",
    message: "Admin delected",
  });
});
