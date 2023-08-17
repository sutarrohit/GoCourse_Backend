"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
process.on("uncaughtException", (err) => {
    console.log(err, "uncaughtException shutting down the application");
    process.exit(1);
});
// Connect to MongoDB database
const MONGODB_URI = process.env.DATABASE || "";
mongoose_1.default.connect(MONGODB_URI, {}).then((con) => {
    // console.log(con.connection);
    console.log("Database Connected Successfully");
});
console.log("Environment: ", process.env.NODE_ENV);
app_1.app.listen(process.env.PORT || 3000, () => {
    console.log("Server start on the port", process.env.PORT);
});
process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message);
    console.log("unhandledRejection shutting down the application");
    process.exit(1);
});
