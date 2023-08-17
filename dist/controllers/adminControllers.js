"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.updateAdmin = exports.adminUpdatePassword = exports.adminResetPassword = exports.adminForgotPassword = exports.adminLogin = exports.adminSignup = exports.getAdmin = void 0;
const userModel_1 = require("../model/userModel");
const authControllers_1 = require("../controllers/authControllers");
const userControllers_1 = require("../controllers/userControllers");
const catchAsync_1 = __importDefault(require("../Utils/catchAsync"));
const appError_1 = __importDefault(require("../Utils/appError"));
// Get Admin info
exports.getAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield userModel_1.User.findOne({ role: "admin" });
    if (!admin)
        throw new appError_1.default("There is no admin", 404);
    res.json({
        status: "success",
        message: admin,
    });
}));
// Admin Signup
exports.adminSignup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield userModel_1.User.findOne({ role: "admin" });
    if (admin)
        throw new appError_1.default("Admin already present", 401);
    const newAdmin = yield userModel_1.User.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: "admin",
    });
    const jwtToken = yield (0, authControllers_1.signToken)(newAdmin._id);
    res.status(200).json({
        status: "success",
        message: "Admin created successfully",
        user: newAdmin,
        token: jwtToken,
    });
}));
// Admin Login
exports.adminLogin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield userModel_1.User.findOne({ email: req.body.email });
    if (!admin || admin.role !== "admin")
        throw new appError_1.default("Your are unathoriazed to access admin routes", 401);
    (0, authControllers_1.login)(req, res, next);
}));
// Admin Forgot Password
exports.adminForgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield userModel_1.User.findOne({ email: req.body.email });
    if (!admin || admin.role !== "admin")
        throw new appError_1.default("Your are unathoriazed to access admin routes", 401);
    (0, authControllers_1.forgetPassword)(req, res, next);
}));
// Admin Reset Password
exports.adminResetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authControllers_1.resetPassowrd)(req, res, next);
}));
// Admin Forgot Password
exports.adminUpdatePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, authControllers_1.updatePassword)(req, res, next);
}));
// Admin Update data
exports.updateAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, userControllers_1.updateMe)(req, res, next);
}));
// Delete Admin
exports.deleteAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield userModel_1.User.findByIdAndDelete(req.user._id);
    if (!admin)
        throw new appError_1.default("Unable to delete admin", 404);
    res.status(200).json({
        status: "success",
        message: "Admin delected",
    });
}));
