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
        sendErrorProd(err,res);
    }
    
}