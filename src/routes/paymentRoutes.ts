import express, { Router } from "express";
import { payment } from "../controllers/paymentController";

const paymentRoutes: Router = express.Router();
paymentRoutes.route("/create-checkout-session").post(payment);

export default paymentRoutes;
