const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }
        error.message = err.message

        //Wrong Mongoose Object ID Error

        if (err.name === 'CastError') {
            const message = `Resource not found.Invalid ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        //Handling Mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message)
            error = new ErrorHandler(message, 400)
        }

        //Handling mongoose dulpicate key error
        if (err.code === 11000) {
            const keys = err.keyValue ? Object.keys(err.keyValue) : null;
            const message = keys ? `Duplicate ${keys} entered` : 'Duplicate field entered';
            error = new ErrorHandler(message, 400);
        }
        //Handling wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            const message = 'Json Web Token is invalid. Try Again!!!'
            error = new ErrorHandler(message, 400)
        }

        //Handling expired JWT error
        if (err.name === 'TokenExpiredError') {
            const message = 'Json Web Token is Expired. Try Again!!!'
            error = new ErrorHandler(message, 400)
        }


        res.status(err.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'

        })

    }


}
