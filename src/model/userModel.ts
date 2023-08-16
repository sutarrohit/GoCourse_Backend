import mongoose, { Schema, Document, Model, Query } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { IuserSchema } from "../interfaces/userInterfaces";

const userSchema: Schema<IuserSchema> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
  },

  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide valid email address"],
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
      validator: function (this: IuserSchema, el: string) {
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
      type: Schema.Types.ObjectId,
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
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = "";
  next();
});

// Store date when user change its password.
userSchema.pre("save", function (next) {
  //CHECK PASSWORD MODIFIED
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChengedAt = new Date(Date.now() - 1000);
  next();
});

// Return only active user
userSchema.pre<Query<IuserSchema, IuserSchema>>(/^find/, function (next) {
  this.find({ active: true });
  next();
});

// ------- MogonDB Methods --------

// Check if user already brought course
userSchema.methods.CheckPurchasedCourses = async function (courseId: any) {
  return this.purchasedCourses.some((data: any) => {
    return data.toString() == courseId.toString();
  });
};

// Model method to compare user password and database password
userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Model method to check if user changed password.
userSchema.methods.changePasswordAfter = async function (JWTTimeStamp: any) {
  if (this.passwordChangedAt) {
    const changedTimeStamp: number = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

// Create password rest token
userSchema.methods.createPasswordResetToken = async function () {
  try {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  } catch (error) {
    return error;
  }
};

// Create signup verificatoin token
userSchema.methods.createVerificationToken = async function () {
  try {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    this.signupVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    this.signupVerificationExpires = Date.now() + 60 * 60 * 1000;

    return verificationToken;
  } catch (error) {
    return error;
  }
};

export const User: Model<IuserSchema> = mongoose.model<IuserSchema>("UserAuth", userSchema);
