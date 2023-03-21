const ErrorHandler= require('../utils/errorHandler')

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message ||'internal server error';
    
    //Wrong mongoDb Id Error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid :${err.path}`;
        err = new ErrorHandler(message,400);
    }
    //duplicate error token
    if(err.code === 11000){
        const message = `Duplicate :${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }
    
    //Json Web Token error
    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid or try again.`;
        err = new ErrorHandler(message,400);
    }
    //JWT Expire error
    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token Error`;
        err = new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success : false,
        err :err.message
    })
}