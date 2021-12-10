// Server
const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config({path:'./config.env'})


//* It is synchronous error like logging undefined variable etc.
process.on('uncaughtException',(err)=>{
  console.log(err.name,err.message);
  console.log('uncaught Exception somewhere. server shutting down..☹️')
  process.exit(1);
})



const DB= process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

mongoose.connect(DB,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:true,
  useUnifiedTopology:true
})
.then(()=>{
  console.log("database connection succesfull!");
})
//* even if catch block is not defined event handler catches the unhandled rejection.
.catch((err)=>{
  console.log('database connection failed!')
  console.log(err)
})

const app = require('./app');
const port = process.env.PORT || 8000;

// console.log(process.env)

const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

//* 1)when there is no catch block for a promise or async await rejection should be handled in the below way
//* 2).then() cannot be kept under try catch because .then() is asynchronous and executes after catch() executes 
//* 3) In a promise function accepts two callback fns resolve, reject. if reject is not present in then or catch is not chained then
//*    unhandledRejection is emitted
process.on('unhandledRejection',(err)=>{
  console.log(err.name,err.message);
  console.log('unhandled rejection somewhere. server shutting down..☹️')
  server.close((err)=>{
    process.exit(1);
  })
})

