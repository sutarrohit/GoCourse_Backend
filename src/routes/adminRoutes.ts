import express, { Router, Request, Response, NextFunction } from "express";
import { protect, protectAdmin } from "../controllers/authControllers";
import {
  getAdmin,
  adminSignup,
  adminLogin,
  adminForgotPassword,
  adminUpdatePassword,
  updateAdmin,
  deleteAdmin,
  adminResetPassword,
} from "../controllers/adminControllers";
const adminRoutes: Router = express.Router();

adminRoutes.route("/me").get(protect, protectAdmin, getAdmin);

adminRoutes.route("/signup").post(adminSignup);
adminRoutes.route("/login").post(adminLogin);

adminRoutes.route("/forgotPassword").post(adminForgotPassword);
adminRoutes.route("/resetPassword/:token").patch(adminResetPassword);
adminRoutes.route("/updatePassword").post(protect, protectAdmin, adminUpdatePassword);

adminRoutes.route("/updateAdmin").patch(protect, protectAdmin, updateAdmin);
adminRoutes.route("/deleteAdmin").delete(protect, protectAdmin, deleteAdmin);

export default adminRoutes;
