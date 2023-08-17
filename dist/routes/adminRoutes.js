"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const adminControllers_1 = require("../controllers/adminControllers");
const adminRoutes = express_1.default.Router();
adminRoutes.route("/me").get(authControllers_1.protect, authControllers_1.protectAdmin, adminControllers_1.getAdmin);
adminRoutes.route("/signup").post(adminControllers_1.adminSignup);
adminRoutes.route("/login").post(adminControllers_1.adminLogin);
adminRoutes.route("/forgotPassword").post(adminControllers_1.adminForgotPassword);
adminRoutes.route("/resetPassword/:token").patch(adminControllers_1.adminResetPassword);
adminRoutes.route("/updatePassword").post(authControllers_1.protect, authControllers_1.protectAdmin, adminControllers_1.adminUpdatePassword);
adminRoutes.route("/updateAdmin").patch(authControllers_1.protect, authControllers_1.protectAdmin, adminControllers_1.updateAdmin);
adminRoutes.route("/deleteAdmin").delete(authControllers_1.protect, authControllers_1.protectAdmin, adminControllers_1.deleteAdmin);
exports.default = adminRoutes;
