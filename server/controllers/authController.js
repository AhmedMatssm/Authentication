const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sessionManager = require('./../utils/sessionManager');

const User = require('../Models/userModel');
const { CurrencyCodes } = require('validator/lib/isISO4217');

// Function to sign token
const signToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Function to create and send JWT token
const createAndSendToken = (user, statusCode, req, res) =>{
    // a) create and sign token
    const token = signToken(user._id);
    // b) send cookie containing the token
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000),
        httpOnly: true
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    // c) remove the password from the output
    user.password = undefined;
    // d) send response back
    res.status(statusCode).json({
        status: 'success',
        token,
        date:{
            user
        }
    });
};

// Midleware to protect routes, check if user is logged in
exports.protect = catchAsync(async (req, res, next) =>{
    // 1) getting token and check if it exists
    let token;
    if(req.headers.authorization && req.headers.authorization.startWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.',401));
    }

    // 2) verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3) check if user still exists
    const currrentUser = await User.findById(decoded.id);

    if(!currrentUser){
        return next(new AppError('The user belonging to this token does no longer exists', 401));
    }
    // 4) check if user changed password after the JWT was issued
    if(currrentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // 5) everything ok grant access
    req.user = currrentUser;
    next();
});

// user singup functionality
exports.signupUser = catchAsync(async (req, res, next) =>{
    const {username, email, password} = req.body;
    console.log(res)

    // check if user already exists
    const existingUser = await User.findOne({email});
    if(existingUser){
        res.status(400);
        throw new Error('User already exists');
    }

    // create the user without any profile-related data
    const newUser = await User.create({
        username,
        email,
        password
    });

    // send response with user details and authentication token
    createAndSendToken(newUser, 200, req, res);
});

// User login functionality
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exists
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if email exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    //3) If everything Ok, send Token to client
        // إنشاء الجلسة قبل إرسال الاستجابة
        const token = signToken(user._id);
        sessionManager.startSession(user._id, token);
        //  إرسال الاستجابة فقط من `createAndSendToken()`
        createAndSendToken(user, 200, req, res);
});

// User logout functionality
exports.logout = (req, res) => {
     // 1) إنهاء الجلسة باستخدام Singleton
     const userId = req.user._id; // الحصول على معرف المستخدم من الطلب
     sessionManager.endSession(userId); // إنهاء جلسة المستخدم

    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

