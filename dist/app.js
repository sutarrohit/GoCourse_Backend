"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = require("express-rate-limit");
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const hpp_1 = __importDefault(require("hpp"));
const dotenv_1 = __importDefault(require("dotenv"));
const appError_1 = __importDefault(require("./Utils/appError"));
const globalErrorController_1 = __importDefault(require("./controllers/globalErrorController"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_DOMAIN, // Replace with your actual frontend origin
    // methods: "GET,POST", // Specify the allowed HTTP methods
    // allowedHeaders: "Content-Type,Authorization", // Specify the allowed headers
}));
// app.use(cors());
//----- Middlewares -----
app.use(express_1.default.json({ limit: "100kb" }));
// Data sanitization against NoSOL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Data sanitization against site script XSS
app.use((req, res, next) => {
    const sanitizedInput = (0, sanitize_html_1.default)(req.body.userInput, {
        allowedTags: [],
        allowedAttributes: {}, // Object specifying allowed attributes for each tag
    });
    next();
});
// hpp to protect against HTTP Parameter Pollution attacks.
app.use((0, hpp_1.default)());
// To secure HTTP header
app.use((0, helmet_1.default)());
if (process.env.NODE_ENV == "development") {
    app.use((0, morgan_1.default)("dev"));
}
// Limit number of request
const limiter = (0, express_rate_limit_1.rateLimit)({
    max: 1000,
    windowMs: 10 * 60 * 1000,
    message: "Too many request from this ip, Please try again",
});
app.use(limiter);
//----- Endpoints ----
app.use("/api/v1/user/", userRoutes_1.default);
app.use("/api/v1/admin", adminRoutes_1.default);
app.use("/api/v1/course", courseRoutes_1.default);
app.use("/api/v1/payment", paymentRoutes_1.default);
app.all("*", (req, res, next) => {
    const err = new appError_1.default(`Can't find ${req.originalUrl} on this server`, 404);
    next(err);
});
// Global Error Handling
app.use(globalErrorController_1.default);
