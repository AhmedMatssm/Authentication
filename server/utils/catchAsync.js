// Define catchAsync as a function that wraps asynchronous middleware functions
const catchAsync = (fn) => {
    // Return a new function that executes the provided middleware function and catches any errors
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
  
  // Export catchAsync function
  module.exports = catchAsync;