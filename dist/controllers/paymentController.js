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
exports.payment = void 0;
const stripe = require("stripe")(process.env.STRIP_SCERET_KEY);
const courseModel_1 = require("../model/courseModel");
const appError_1 = __importDefault(require("../Utils/appError"));
const catchAsync_1 = __importDefault(require("../Utils/catchAsync"));
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;
exports.payment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield courseModel_1.Course.findById(req.body.userData);
    if (!course)
        throw new appError_1.default("Unable to find coures", 404);
    // Create Price Id
    const price = yield stripe.prices.create({
        unit_amount: course.price * 100,
        currency: "inr",
        product_data: {
            name: course.title,
        },
    });
    // Create payment link
    const session = yield stripe.checkout.sessions.create({
        line_items: [
            {
                price: price.id,
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${CLIENT_DOMAIN}/liveCourse/${course._id}?success=true`,
        cancel_url: `${CLIENT_DOMAIN}?canceled=true`,
    });
    res.status(200).json({
        paymentUrl: session.url,
        session: session,
    });
}));
