import express, { Router, Request, Response, NextFunction } from "express";
const stripe = require("stripe")(process.env.STRIP_SCERET_KEY);
import { Course } from "../model/courseModel";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";

const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN;

export const payment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const course = await Course.findById(req.body.userData);

    if (!course) throw new AppError("Unable to find coures", 404);

    // Create Price Id
    const price = await stripe.prices.create({
      unit_amount: course.price * 100,
      currency: "inr",
      product_data: {
        name: course.title,
      },
    });

    // Create payment link
    const session = await stripe.checkout.sessions.create({
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
  }
);
