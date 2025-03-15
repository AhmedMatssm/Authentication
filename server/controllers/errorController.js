// import custom error handler
const AppError = require('./../utils/appError');

// handle casting error from MongoDB
const handleCastErrorDB = (err) =>{
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

// handle duplicate field error from MongoDB
const handleDuplicateFieldDB = (err) =>{
    // Extracting the duplicate value from the error message
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value ${value}. Please use another value!`;
    return new AppError(message, 400);
};

// handle validation error from MongoDB
const handleValidationErrorDB = (err) =>{
    // Extracting  error message from the validation errors
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('.')}`;
    return new AppError(message, 400);
};

// handle invalid JSON web token error
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

// handle expired JSON web token errror
handleJWTExpiresdError = ()=> new AppError('You token has expired! Please log in again.', 401);

// Send error response in development enviroment
const sendErrorDev = (err, req, res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// send error response in production environment
const sendErrorProd = (err, req, res) =>{
    if(err.isOperational){
        // send detailed error message for operational errors
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }else{
        // 1) log the error for debugging purposes
        console.error('ERROR 💥💥💥', err);
        // 2) send generic error message for non-operational errors
        res.status(500).json({
            status: 'error',
            message: 'Oops! Something went wrong.'
        });
    }
};

// global error handling middleware
module.exports = (err, req, res, next) =>{
    // Initialize status code and status for non-genrated errors
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Execute appropriate error handling based on environment
    if(process.env.NODE_ENV === 'development'){
        // send detailed error response in development environment
        sendErrorDev(err, req, res);
    }else if(process.env.NODE_ENV === 'production'){
        // clone the error object to prevent modification
        let error = {...err};
        error.message = err.message;

        // handle specific error types for production environment
        if(error.name === 'CastError') error = handleCastErrorDB(err);
        if(error.code === 11000) error = handleDuplicateFieldsDB(err);
        if(error.name === 'ValidationError') error = handleValidationErrorDB(err);
        if(error.name === 'JsonWebTokenError') error = handleJWTError();
        if(error.name === 'TokenExpiredError') error = handleJWTExpiresdError();

        // Send error response in production environment
        sendErrorProd(error, req, res);
    }
};