// custom error class extending the error class
class AppError extends Error{
    constructor(message, statusCode){
        // call the parent class constructor with the provider message
        super(message);

        // set the status code and status based on the provider statusCode
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // define stack trace for debugging purposes
        Error.captureStackTrace(this, this.constructor);
    }
}

// export the AppError class
module.exports = AppError;