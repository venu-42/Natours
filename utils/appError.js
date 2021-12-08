class AppError extends Error {
    constructor(message,statusCode){
        super(message);

        this.statusCode=statusCode;
        if(statusCode>=500) this.status = 'error'
        else if(statusCode>=400) this.status = 'fail'
        else if(statusCode>=300) this.status = 'redirection'
        else if(statusCode>=200) this.status = 'success'

        this.isOperational = true;
        Error.captureStackTrace(this,this.constructor)
    }

}

module.exports = AppError