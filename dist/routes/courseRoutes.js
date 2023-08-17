"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controllers/courseController");
const authControllers_1 = require("../controllers/authControllers");
const courseRoutes = express_1.default.Router();
// courseRoutes.route("/courses").get(protect, getCourses);
courseRoutes.route("/courses").get(courseController_1.getCourses);
courseRoutes.route("/getPurcheaseCourse").get(authControllers_1.protect, courseController_1.getPurcheaseCourse);
courseRoutes.route("/course/:courseId").get(courseController_1.getOneCourse);
courseRoutes.route("/createCourse").post(authControllers_1.protect, authControllers_1.protectAdmin, courseController_1.createCourse);
courseRoutes.route("/updateCourse/:courseId").patch(authControllers_1.protect, authControllers_1.protectAdmin, courseController_1.updateCourse);
courseRoutes.route("/purcheaseCourse/:courseId").post(authControllers_1.protect, courseController_1.purcheaseCourse);
courseRoutes.route("/broughtCourses").get(authControllers_1.protect, courseController_1.broughtCourses);
exports.default = courseRoutes;
