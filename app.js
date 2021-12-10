const express = require('express');

const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const GlobalErrorHandler = require('./controllers/errorControllers')

const app = express();

// middlewares
app.use(express.json());

if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'));   
}

app.use(express.static(`${__dirname}/public/`))

app.use((req,res,next)=>{
    req.requestTime= new Date().toISOString();
    next();
})


// Routers
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);


// Handle all other routes (since its a API we will send only json responses)
app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:"fail",
    //     message:`The requested URL ${req.originalUrl} is not found`
    // })
    next(new AppError(`The requested URL ${req.originalUrl} is not found`,404))
})

app.use(GlobalErrorHandler)


module.exports= app;