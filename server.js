// Server
const mongoose = require('mongoose')
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})

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
.catch((err)=>{
  console.log('database connection failed!')
  console.log(err)
})



const app = require('./app');
const port = process.env.PORT || 8000;

// console.log(process.env)

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
