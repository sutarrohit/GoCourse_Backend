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
exports.getPurcheaseCourse = exports.broughtCourses = exports.purcheaseCourse = exports.updateCourse = exports.createCourse = exports.getOneCourse = exports.getCourses = void 0;
const courseModel_1 = require("../model/courseModel");
const catchAsync_1 = __importDefault(require("../Utils/catchAsync"));
const appError_1 = __importDefault(require("../Utils/appError"));
const userModel_1 = require("../model/userModel");
// Get courses
exports.getCourses = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield courseModel_1.Course.find({ published: true });
    if (courses.length === 0)
        throw new appError_1.default("There no course exits", 404);
    res.status(200).json({
        courses: courses,
        status: "success",
    });
}));
// Get single course
exports.getOneCourse = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield courseModel_1.Course.findOne({ _id: req.params.courseId });
    if (!course)
        throw new appError_1.default("Course not found", 404);
    res.status(200).json({
        status: "success",
        course: course,
    });
}));
// Create courses
exports.createCourse = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    const newCourse = yield courseModel_1.Course.create(courseData);
    res.status(200).json({
        status: "success",
        newCourse: newCourse,
    });
}));
// Update course
const updateCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    const course = yield courseModel_1.Course.findOneAndUpdate({ _id: courseId }, req.body);
    if (!course)
        throw new appError_1.default("Course not found", 404);
    res.status(200).json({
        status: "success",
        course: course,
        mesaage: "Course updated",
    });
});
exports.updateCourse = updateCourse;
// Purchease course
exports.purcheaseCourse = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield courseModel_1.Course.findOne({ _id: req.params.courseId });
    if (!course)
        throw new appError_1.default("Course doesn't exits", 404);
    const user = yield userModel_1.User.findById(req.user._id);
    if (!user)
        throw new appError_1.default("User doesn't exits", 404);
    const alreadyBrought = yield user.CheckPurchasedCourses(course._id);
    if (alreadyBrought)
        throw new appError_1.default("You have already brought this course", 404);
    user.purchasedCourses.push(course);
    yield user.save();
    res.status(200).json({
        status: "success",
    });
}));
// Courses brought by user
exports.broughtCourses = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.findById(req.user._id);
    if (!user)
        throw new appError_1.default("Unable to fetch user data", 404);
    const courses = yield courseModel_1.Course.find({ _id: { $in: user.purchasedCourses } });
    if (courses.length === 0) {
        res.status(404).json({
            status: "fail",
            courses: [],
            message: "You don't have any paid course",
        });
    }
    else {
        res.status(200).json({
            status: "success",
            courses: courses,
        });
    }
}));
// Get user purchased courses
exports.getPurcheaseCourse = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.findById(req.user._id);
    if (!user)
        throw new appError_1.default("User doesn't exits", 404);
    const getCourses = user.purchasedCourses;
    res.status(200).json({
        coures: getCourses,
    });
}));
