const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const { createAdmin } = require('./utils/adminCreate.js');

const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');

const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const userRouter = require('./routes/userRoutes')

const app = express();
// createAdmin();

// 1) Middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// set security http headers
app.use(helmet());

// general middleware

// body parser, reading data from body into req.body
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));

// parse cookies
app.use(cookieParser());

// log request in dev
if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// other securty middleware

// limit requests from same IP
const limiter = rateLimit({
    max: 1000,
    windowMs: 120 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});

app.use(cors({credentials: true, origin: true}));
app.use('/api', limiter);

// data sanitization against NoSQL query Injection
app.use(mongoSanitize());

// avoid http parameter pollution 
app.use(hpp({
    whitelist: ['price']
})
);

// avoid xss injection
app.use(xss());

// compression using gzip
app.use(compression());

// Routes
app.use('/api/users', userRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next){
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

// global error handler
app.use(globalErrorHandler);

// exports app
module.exports = app


