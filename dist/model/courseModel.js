"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const courseSchema = new mongoose_1.default.Schema({
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
exports.Course = mongoose_1.default.model("courseSchemas", courseSchema);
