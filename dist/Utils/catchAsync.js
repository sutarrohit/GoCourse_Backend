"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync = (myFn) => {
    return (req, res, next) => {
        myFn(req, res, next).catch((error) => next(error));
    };
};
exports.default = catchAsync;
