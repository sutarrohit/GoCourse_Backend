"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please provide valid email address"],
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please Provide a Password"],
        minlength: 8,
        maxlength: 50,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, "please confirm your password"],
        select: false,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "The password is not same",
        },
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    signupVerificationToken: { type: String || undefined },
    signupVerificationExpires: { type: Date || undefined },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    purchasedCourses: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Course",
            unique: false,
        },
    ],
    passwordChengedAt: { type: Date || undefined },
    passwordResetToken: { type: String || undefined },
    passwordResetExpires: { type: Date || undefined },
});
// ------- MogonDB Middlewares --------
// Encrypt password and store to the database
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password"))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        this.confirmPassword = "";
        next();
    });
});
// Store date when user change its password.
userSchema.pre("save", function (next) {
    //CHECK PASSWORD MODIFIED
    if (!this.isModified("password") || this.isNew)
        return next();
    this.passwordChengedAt = new Date(Date.now() - 1000);
    next();
});
// Return only active user
userSchema.pre(/^find/, function (next) {
    this.find({ active: true });
    next();
});
// ------- MogonDB Methods --------
// Check if user already brought course
userSchema.methods.CheckPurchasedCourses = function (courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.purchasedCourses.some((data) => {
            return data.toString() == courseId.toString();
        });
    });
};
// Model method to compare user password and database password
userSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(candidatePassword, userPassword);
    });
};
// Model method to check if user changed password.
userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.passwordChangedAt) {
            const changedTimeStamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
            return JWTTimeStamp < changedTimeStamp;
        }
        return false;
    });
};
// Create password rest token
userSchema.methods.createPasswordResetToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resetToken = crypto_1.default.randomBytes(32).toString("hex");
            this.passwordResetToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
            this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
            return resetToken;
        }
        catch (error) {
            return error;
        }
    });
};
// Create signup verificatoin token
userSchema.methods.createVerificationToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
            this.signupVerificationToken = crypto_1.default.createHash("sha256").update(verificationToken).digest("hex");
            this.signupVerificationExpires = Date.now() + 60 * 60 * 1000;
            return verificationToken;
        }
        catch (error) {
            return error;
        }
    });
};
exports.User = mongoose_1.default.model("UserAuth", userSchema);
