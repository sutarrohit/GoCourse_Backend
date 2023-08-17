"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const authControllers_1 = require("../controllers/authControllers");
const userRoutes = express_1.default.Router();
// User Routes
userRoutes.route("/aa").get(authControllers_1.protect, userControllers_1.userdata);
userRoutes.route("/updateMe").patch(authControllers_1.protect, userControllers_1.updateMe);
userRoutes.route("/deleteMe").patch(authControllers_1.protect, userControllers_1.deleteMe);
// User Auth Routes
userRoutes.route("/signup").post(authControllers_1.signup);
userRoutes.route("/login").post(authControllers_1.login);
userRoutes.route("/forgotPassword").post(authControllers_1.forgetPassword);
userRoutes.route("/resetPassword/:token").patch(authControllers_1.resetPassowrd);
userRoutes.route("/userVerification/:token").patch(authControllers_1.userVerification);
userRoutes.route("/updatePassword").patch(authControllers_1.protect, authControllers_1.updatePassword);
exports.default = userRoutes;
