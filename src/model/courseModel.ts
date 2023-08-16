import mongoose, { Schema, Model, Query } from "mongoose";
import { IcourseSchema } from "../interfaces/courseInterface";

const courseSchema: Schema<IcourseSchema> = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter Titile"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Description"],
  },
  instructor: {
    type: String,
    required: [true, "Please Enter Instructor Name"],
  },
  duration: {
    type: Number,
    required: [true, "Please Enter Duration"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Price"],
  },
  language: {
    type: String,
    required: [true, "Please Enter Language"],
  },
  image: {
    type: String || undefined,
  },
  videoLink: {
    type: String || undefined,
  },
  rating: {
    type: Number || undefined,
  },
  courseContent: {
    type: [String],
  },
  published: {
    type: Boolean,
    default: true,
  },

  enrollments: {
    type: Number || undefined,
  },
  createdAt: {
    type: Date,
    required: [true, "Created data is undefined"],
  },

  updatedAt: {
    type: Date,
  },
});

export const Course: Model<IcourseSchema> = mongoose.model<IcourseSchema>("courseSchemas", courseSchema);
