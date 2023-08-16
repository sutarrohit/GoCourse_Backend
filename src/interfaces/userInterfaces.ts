import { Document, ObjectId } from "mongoose";
import { IcourseSchema } from "./courseInterface";

// Interfaces
export interface IuserSchema extends Document {
  name: string;
  email: string;
  photo?: string;
  password: string;
  confirmPassword: string;
  isVerified: boolean;
  signupVerificationToken: string | undefined;
  signupVerificationExpires: Date | undefined;
  role: string;
  passwordChengedAt: Date | undefined;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  active: Boolean;
  purchasedCourses: IcourseSchema["_id"][]; // Array of Course references (Array of ObjectIds)
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  changePasswordAfter(candidatePassword: number): Promise<boolean>;
  createPasswordResetToken(): Promise<string>;
  CheckPurchasedCourses(courseId: any): Promise<boolean>;
  createVerificationToken(): Promise<string>;
}

// User interface for Request
export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  role: string;
}
