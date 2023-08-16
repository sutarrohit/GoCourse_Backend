import express, { Request, Response, NextFunction } from "express";
import { Course } from "../model/courseModel";
import catchAsync from "../Utils/catchAsync";
import AppError from "../Utils/appError";
import { User } from "../model/userModel";

// Get courses
export const getCourses = catchAsync(async (req: Response, res: Response, next: NextFunction) => {
  const courses = await Course.find({ published: true });

  if (courses.length === 0) throw new AppError("There no course exits", 404);

  res.status(200).json({
    courses: courses,
    status: "success",
  });
});

// Get single course
export const getOneCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const course = await Course.findOne({ _id: req.params.courseId });

  if (!course) throw new AppError("Course not found", 404);

  res.status(200).json({
    status: "success",
    course: course,
  });
});

// Create courses
export const createCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const courseData = {
    title: req.body.title,
    description: req.body.description,
    instructor: req.body.instructor,
    duration: req.body.duration,
    price: req.body.price,
    language: req.body.language,
    image: req.body.image || "",
    videoLink: req.body.videoLink || "",
    rating: req.body.rating,
    courseContent: req.body.courseContent,
    createdAt: new Date(),
  };

  const newCourse = await Course.create(courseData);

  res.status(200).json({
    status: "success",
    newCourse: newCourse,
  });
});

// Update course
export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  const courseId = req.params.courseId;

  const course = await Course.findOneAndUpdate({ _id: courseId }, req.body);
  if (!course) throw new AppError("Course not found", 404);

  res.status(200).json({
    status: "success",
    course: course,
    mesaage: "Course updated",
  });
};

// Purchease course
export const purcheaseCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const course = await Course.findOne({ _id: req.params.courseId });
  if (!course) throw new AppError("Course doesn't exits", 404);

  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User doesn't exits", 404);

  const alreadyBrought = await user.CheckPurchasedCourses(course._id);
  if (alreadyBrought) throw new AppError("You have already brought this course", 404);

  user.purchasedCourses.push(course);
  await user.save();

  res.status(200).json({
    status: "success",
  });
});

// Courses brought by user
export const broughtCourses = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("Unable to fetch user data", 404);

  const courses = await Course.find({ _id: { $in: user.purchasedCourses } });
  if (courses.length === 0) {
    res.status(404).json({
      status: "fail",
      courses: [],
      message: "You don't have any paid course",
    });
  } else {
    res.status(200).json({
      status: "success",
      courses: courses,
    });
  }
});

// Get user purchased courses
export const getPurcheaseCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new AppError("User doesn't exits", 404);

  const getCourses = user.purchasedCourses;

  res.status(200).json({
    coures: getCourses,
  });
});
