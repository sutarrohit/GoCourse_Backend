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
exports.deleteMe = exports.updateMe = exports.userdata = void 0;
const userModel_1 = require("../model/userModel");
const appError_1 = __importDefault(require("../Utils/appError"));
const catchAsync_1 = __importDefault(require("../Utils/catchAsync"));
// Functions
exports.userdata = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.find();
    res.status(200).json({
        status: "success",
        data: user,
    });
}));
// Update User data
exports.updateMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Create error if user want to update password
    if (req.body.password || req.body.passwordConfirm)
        throw new appError_1.default("This route is not for password update", 402);
    const { name, email, photo } = req.body;
    const updateUser = yield userModel_1.User.findByIdAndUpdate(req.user._id, { name: name, email: email, photo: photo }, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: "success",
        data: {
            user: updateUser,
        },
    });
}));
// Delete User account
exports.deleteMe = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield userModel_1.User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(200).json({
        status: "success",
        message: "User account deleted.",
    });
}));
