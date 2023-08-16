import { app } from "./app";
import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

process.on("uncaughtException", (err: Error) => {
  console.log(err, "uncaughtException shutting down the application");
  process.exit(1);
});

// Connect to MongoDB database
const MONGODB_URI: string = process.env.DATABASE || "";
mongoose.connect(MONGODB_URI, {}).then((con: Mongoose) => {
  // console.log(con.connection);
  console.log("Database Connected Successfully");
});

console.log("Environment: ", process.env.NODE_ENV);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server start on the port", process.env.PORT);
});

process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("unhandledRejection shutting down the application");
  process.exit(1);
});
