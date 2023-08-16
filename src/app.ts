import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import sanitizeHtml from "sanitize-html";
import hpp from "hpp";
import dotenv from "dotenv";
import AppError from "./Utils/appError";
import globalErrorHandler from "./controllers/globalErrorController";
import { IUser } from "../src/interfaces/userInterfaces";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import courseRoutes from "./routes/courseRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import cors from "cors";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

dotenv.config();
const app: Express = express();

app.use(
  cors({
    origin: process.env.CLIENT_DOMAIN, // Replace with your actual frontend origin
    // methods: "GET,POST", // Specify the allowed HTTP methods
    // allowedHeaders: "Content-Type,Authorization", // Specify the allowed headers
  })
);

//----- Middlewares -----
app.use(express.json({ limit: "100kb" }));

// Data sanitization against NoSOL query injection
app.use(mongoSanitize());

// Data sanitization against site script XSS
app.use((req, res, next) => {
  const sanitizedInput = sanitizeHtml(req.body.userInput, {
    allowedTags: [], // Array of allowed HTML tags (empty array allows no tags)
    allowedAttributes: {}, // Object specifying allowed attributes for each tag
  });
  next();
});

// hpp to protect against HTTP Parameter Pollution attacks.
app.use(hpp());

// To secure HTTP header
app.use(helmet());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// Limit number of request
const limiter = rateLimit({
  max: 1000,
  windowMs: 10 * 60 * 1000,
  message: "Too many request from this ip, Please try again",
});
app.use(limiter);

//----- Endpoints ----
app.use("/api/v1/user/", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});

// Global Error Handling
app.use(globalErrorHandler);

export { app };
