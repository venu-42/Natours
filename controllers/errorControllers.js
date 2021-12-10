const AppError = require('../utils/appError');

const handleCastErrorDB= (err)=>{
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message,400);
}

const handleDuplicateNameDB= (err)=>{
    const errors = Object.values(err.keyValue)
    const message = `following are duplicate values: ${errors.join('. ')}`
    return new AppError(message,400);
}

const handleValidationErrorDB= (err)=>{
    const errors = Object.values(err.errors).map(el=>el.message)
    const message = `Invalid input data ${errors.join('. ')}`
    return new AppError(message,400);
}


const sendErrorDev = (err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        error:err,
        errStack:err.stack
    })
}

const sendErrorProd = (err,res)=>{
    //* Type of errors we expected (user's wrong input, not found errors etc). these are solved using AppError class we created
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })
    }
    //* programming or other unknown errors (logical errors etc) : shouldn't leak errors to public
    else{
        console.error(err);
        
        res.status(500).json({
            status:'error',
            message:'something really went wrong!'
        })
    }
}

module.exports = (err,req,res,next)=>{
    // console.log(err.stack)
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res);
    }
    else if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        //Todo error object not receiving property name from err so compared with the original err only
        if(err.name==='CastError') {
            error = handleCastErrorDB(error);
        }
        else if(err.code===11000){
            error = handleDuplicateNameDB(error);
        }
        else if(err.name==='ValidationError'){
            error = handleValidationErrorDB(error)
        }
        sendErrorProd(error,res);
    }
    
}