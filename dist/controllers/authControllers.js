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
exports.protectAdmin = exports.protect = exports.updatePassword = exports.userVerification = exports.resetPassowrd = exports.forgetPassword = exports.login = exports.signup = exports.signToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = require("../model/userModel");
const Gmail_1 = require("../Utils/Gmail");
const appError_1 = __importDefault(require("../Utils/appError"));
const catchAsync_1 = __importDefault(require("../Utils/catchAsync"));
dotenv_1.default.config();
// Create JWT Token
const signToken = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const secretKey = process.env.JWT_SECRET || "";
    const payload = { userId: id };
    const options = { expiresIn: process.env.JWT_EXPIRES_IN };
    return jsonwebtoken_1.default.sign(payload, secretKey, options);
});
exports.signToken = signToken;
// Verify JWT Token
const verifyToken = (token, secretKey) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
            if (err) {
                reject(err); // Token verification failed
            }
            else {
                resolve(decoded); // Token verification succeeded, 'decoded' contains the payload
            }
        });
    });
});
// Signup User
exports.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const newUser = await User.create(req.body);
    const newUser = yield userModel_1.User.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    const { name, email, role, _id, isVerified } = newUser;
    // Send verification email
    //Create a random token send to user
    const verificationToken = yield newUser.createVerificationToken();
    yield newUser.save({ validateBeforeSave: false });
    // const verificatonURL = `${req.protocol}://${req.get("host")}/api/v1/user/userVerification/${verificationToken}`;
    const verificationURL = `${process.env.CLIENT_DOMAIN}/verification/${verificationToken}`;
    const message = `To verify your user account, kindly click on the verification link, \n including your verification token via the following link: ${verificationURL}. \n If you have already completed the verification process, please disregard this email. \n Thank you.`;
    // Call send mail function
    const mail = yield (0, Gmail_1.sendEmail)({
        email: req.body.email,
        subject: " Complete User Account Verification, token valid for 60 min",
        message: message,
    });
    if (!mail) {
        newUser.passwordResetToken = undefined;
        newUser.passwordResetExpires = undefined;
        yield newUser.save({ validateBeforeSave: false });
        throw new appError_1.default("Failed to reset password", 401);
    }
    res.status(200).json({
        status: "success",
        message: "User created successfully",
        user: { name, email, role, _id, isVerified },
        verificationToken: verificationToken,
    });
}));
// Login User
exports.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        throw new appError_1.default("Please provide email and password", 400);
    const user = yield userModel_1.User.findOne({ email }).select("+password");
    if (!user || !(yield user.correctPassword(password, user.password)))
        throw new appError_1.default("Incorrect email and password", 401);
    if (!user.isVerified)
        throw new appError_1.default("Please verify your account", 401);
    const jwtToken = yield (0, exports.signToken)(user._id);
    res.status(200).json({
        status: "success",
        token: jwtToken,
        name: user.name,
        _id: user._id,
        role: user.role,
    });
}));
// Forgot Passowrd
exports.forgetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Get user based on the given email
    const user = yield userModel_1.User.findOne({ email: req.body.email });
    if (!user)
        throw new appError_1.default("There in no user with this email", 401);
    //Create a random token send to user
    const resetToken = yield user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    // 3 Send password reset email to the user
    let resetURL;
    if (user.role === "admin") {
        // resetURL = `${req.protocol}://${req.get("host")}/api/v1/admin/resetPassword/${resetToken}`;
        resetURL = `${process.env.CLIENT_DOMAIN}/resetPassword/${resetToken}`;
    }
    else {
        // resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
        resetURL = `${process.env.CLIENT_DOMAIN}/resetPassword/${resetToken}`;
    }
    const message = `Send a request with your updated password to:\n ${resetURL}.\n If you haven't requested a password reset, please disregard this email.`;
    // Call send mail function
    const mail = yield (0, Gmail_1.sendEmail)({
        email: req.body.email,
        subject: "Your Password reset token valid for 10 min",
        message: message,
    });
    if (!mail) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        throw new appError_1.default("Failed to reset password", 401);
    }
    res.status(200).json({
        status: "success",
        message: "Reset password token send to email",
    });
}));
// Reset Passowrd
exports.resetPassowrd = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Get user based on the token
    const hashedToken = crypto_1.default.createHash("sha256").update(req.params.token).digest("hex");
    const user = yield userModel_1.User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
    //If token has not expired and there is is user, set new password
    if (!user)
        throw new appError_1.default("Token is invalid or expired", 401);
    // Password changed.
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    // Login the user and send JWT token.
    const jwtToken = yield (0, exports.signToken)(user._id);
    res.status(200).json({
        status: "success",
        message: "Password changed successfully",
        token: jwtToken,
    });
}));
// Signup verification
exports.userVerification = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedToken = crypto_1.default.createHash("sha256").update(req.params.token).digest("hex");
    const user = yield userModel_1.User.findOne({
        signupVerificationToken: hashedToken,
        signupVerificationExpires: { $gt: Date.now() },
    });
    //If token has not expired and there is is user, set new password
    if (!user)
        throw new appError_1.default("Token is invalid or expired", 401);
    user.isVerified = true;
    user.signupVerificationToken = undefined;
    user.signupVerificationExpires = undefined;
    yield user.save();
    // Login the user and send JWT token.
    res.status(200).json({
        status: "success",
        message: "User verified successfully",
    });
}));
//Update Password
exports.updatePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.User.findById(req.user._id).select("+password");
    if (!user)
        throw new appError_1.default("Unable to find User", 401);
    if (!(yield user.correctPassword(req.body.passwordCurrent, user.password)))
        throw new appError_1.default("Incorrect Current Password", 401);
    if (yield user.correctPassword(req.body.newPassword, user.password))
        throw new appError_1.default("Previous password and new password can't be same", 401);
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmNewPassword;
    yield user.save();
    const jwtToken = yield (0, exports.signToken)(user._id);
    res.status(200).json({
        status: "success",
        token: jwtToken,
    });
}));
// Protechting User Data
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = "";
    // Check Header Data
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
        throw new appError_1.default("Your are not logged in", 401);
    // Validate Token
    const secretKey = process.env.JWT_SECRET || "";
    const decoded = yield verifyToken(token, secretKey);
    // Check User Exits In Database or Not
    const currentUser = yield userModel_1.User.findById(decoded.userId, { passwordChengedAt: 0 });
    if (!currentUser)
        throw new appError_1.default("The User Belongs To This Token No Longer Exits", 401);
    if (!currentUser.isVerified)
        throw new appError_1.default("Please verify your account", 401);
    // Check If User Password Changed
    if (yield currentUser.changePasswordAfter(decoded.iat)) {
        throw new appError_1.default("User recently changed the password", 401);
    }
    // Setting up user data to Request object
    const user = {
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
    };
    // Pass user data to next middleware
    req.user = user;
    next();
}));
// Protect Admin
exports.protectAdmin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.role !== "admin")
        throw new appError_1.default("You are not authorized to access admin routes", 401);
    next();
}));
