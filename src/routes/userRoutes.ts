import express, { Router, Request, Response } from "express";
import { userdata, updateMe, deleteMe } from "../controllers/userControllers";
import {
  signup,
  login,
  protect,
  forgetPassword,
  resetPassowrd,
  updatePassword,
  userVerification,
} from "../controllers/authControllers";

const userRoutes: Router = express.Router();

// User Routes
userRoutes.route("/aa").get(protect, userdata);
userRoutes.route("/updateMe").patch(protect, updateMe);
userRoutes.route("/deleteMe").patch(protect, deleteMe);

// User Auth Routes
userRoutes.route("/signup").post(signup);
userRoutes.route("/login").post(login);
userRoutes.route("/forgotPassword").post(forgetPassword);
userRoutes.route("/resetPassword/:token").patch(resetPassowrd);
userRoutes.route("/userVerification/:token").patch(userVerification);
userRoutes.route("/updatePassword").patch(protect, updatePassword);

export default userRoutes;
