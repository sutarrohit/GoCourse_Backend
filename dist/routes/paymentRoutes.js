"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const paymentRoutes = express_1.default.Router();
paymentRoutes.route("/create-checkout-session").post(paymentController_1.payment);
exports.default = paymentRoutes;
