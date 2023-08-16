import { Document } from "mongoose";

export interface IcourseSchema extends Document {
  title: string;
  description: string;
  instructor: string;
  duration: number;
  price: number;
  language: string;
  image: string | undefined;
  videoLink: string | undefined;
  rating: number | undefined;
  enrollments: number | undefined;
  published: boolean;
  createdAt: Date;
  updatedAt: Date | undefined;
  courseContent: string[];
}
