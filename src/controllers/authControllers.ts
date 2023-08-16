import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../model/userModel";
import { sendEmail } from "../Utils/Gmail";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import { IUser } from "../interfaces/userInterfaces";

dotenv.config();

// Create JWT Token
export const signToken = async (id: number) => {
  const secretKey: Secret = process.env.JWT_SECRET || "";
  const payload: { userId: string | number } = { userId: id };
  const options = { expiresIn: process.env.JWT_EXPIRES_IN };

  return jwt.sign(payload, secretKey, options);
};

// Verify JWT Token
const verifyToken = async (token: string, secretKey: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err); // Token verification failed
      } else {
        resolve(decoded); // Token verification succeeded, 'decoded' contains the payload
      }
    });
  });
};

// Signup User
export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  const { name, email, role, _id, isVerified } = newUser;

  // Send verification email

  //Create a random token send to user
  const verificationToken = await newUser.createVerificationToken();
  await newUser.save({ validateBeforeSave: false });

  // const verificatonURL = `${req.protocol}://${req.get("host")}/api/v1/user/userVerification/${verificationToken}`;
  const verificationURL = `${process.env.CLIENT_DOMAIN}/verification/${verificationToken}`;
  const message = `To verify your user account, kindly click on the verification link, \n including your verification token via the following link: ${verificationURL}. \n If you have already completed the verification process, please disregard this email. \n Thank you.`;
  // Call send mail function
  const mail: boolean = await sendEmail({
    email: req.body.email,
    subject: " Complete User Account Verification, token valid for 60 min",
    message: message,
  });

  if (!mail) {
    newUser.passwordResetToken = undefined;
    newUser.passwordResetExpires = undefined;
    await newUser.save({ validateBeforeSave: false });

    throw new AppError("Failed to reset password", 401);
  }

  res.status(200).json({
    status: "success",
    message: "User created successfully",
    user: { name, email, role, _id, isVerified },
    verificationToken: verificationToken,
  });
});

// Login User
export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) throw new AppError("Please provide email and password", 400);

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    throw new AppError("Incorrect email and password", 401);

  if (!user.isVerified) throw new AppError("Please verify your account", 401);

  const jwtToken = await signToken(user._id);

  res.status(200).json({
    status: "success",
    token: jwtToken,
    name: user.name,
    _id: user._id,
    role: user.role,
  });
});

// Forgot Passowrd
export const forgetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //Get user based on the given email
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new AppError("There in no user with this email", 401);

  //Create a random token send to user
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3 Send password reset email to the user
  let resetURL: string;
  if (user.role === "admin") {
    // resetURL = `${req.protocol}://${req.get("host")}/api/v1/admin/resetPassword/${resetToken}`;
    resetURL = `${process.env.CLIENT_DOMAIN}/resetPassword/${resetToken}`;
  } else {
    // resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    resetURL = `${process.env.CLIENT_DOMAIN}/resetPassword/${resetToken}`;
  }
  const message = `Send a request with your updated password to:\n ${resetURL}.\n If you haven't requested a password reset, please disregard this email.`;

  // Call send mail function
  const mail: boolean = await sendEmail({
    email: req.body.email,
    subject: "Your Password reset token valid for 10 min",
    message: message,
  });

  if (!mail) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError("Failed to reset password", 401);
  }

  res.status(200).json({
    status: "success",
    message: "Reset password token send to email",
  });
});

// Reset Passowrd
export const resetPassowrd = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  //Get user based on the token
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

  //If token has not expired and there is is user, set new password
  if (!user) throw new AppError("Token is invalid or expired", 401);

  // Password changed.
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Login the user and send JWT token.
  const jwtToken = await signToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
    token: jwtToken,
  });
});

// Signup verification
export const userVerification = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    signupVerificationToken: hashedToken,
    signupVerificationExpires: { $gt: Date.now() },
  });

  //If token has not expired and there is is user, set new password
  if (!user) throw new AppError("Token is invalid or expired", 401);

  user.isVerified = true;
  user.signupVerificationToken = undefined;
  user.signupVerificationExpires = undefined;
  await user.save();

  // Login the user and send JWT token.
  res.status(200).json({
    status: "success",
    message: "User verified successfully",
  });
});

//Update Password
export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user._id).select("+password");

  if (!user) throw new AppError("Unable to find User", 401);

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    throw new AppError("Incorrect Current Password", 401);

  if (await user.correctPassword(req.body.newPassword, user.password))
    throw new AppError("Previous password and new password can't be same", 401);

  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmNewPassword;
  await user.save();

  const jwtToken = await signToken(user._id);

  res.status(200).json({
    status: "success",
    token: jwtToken,
  });
});

// Protechting User Data
export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token: string = "";

  // Check Header Data
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) throw new AppError("Your are not logged in", 401);

  // Validate Token
  const secretKey: Secret = process.env.JWT_SECRET || "";
  const decoded = await verifyToken(token, secretKey);

  // Check User Exits In Database or Not
  const currentUser = await User.findById(decoded.userId, { passwordChengedAt: 0 });

  if (!currentUser) throw new AppError("The User Belongs To This Token No Longer Exits", 401);

  if (!currentUser.isVerified) throw new AppError("Please verify your account", 401);

  // Check If User Password Changed
  if (await currentUser.changePasswordAfter(decoded.iat)) {
    throw new AppError("User recently changed the password", 401);
  }

  // Setting up user data to Request object
  const user: IUser = {
    _id: currentUser._id,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
  };
  // Pass user data to next middleware
  req.user = user;

  next();
});

// Protect Admin
export const protectAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role !== "admin") throw new AppError("You are not authorized to access admin routes", 401);
  next();
});
