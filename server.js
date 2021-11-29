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


const tourSchema = new mongoose.Schema({
  name:{
    type:String,
    required: [true,'A tour must have a name'],
    maxLength:25,
    unique:true
  },
  rating:{
    type:Number,
    default:4.5
  },
  price:{
    type:Number,
    required:[true,'A tour must have a price']
  }
})

const Tour = mongoose.model('Tour',tourSchema);
const testTour = new Tour({
  name:"sushanth",
  price:10000
});

testTour.save()
.then(data=>{
  console.log("created 201 --->🔥")
})
.catch(err=>{
  console.log("something bad happened 😭");
})


const app = require('./app');
const port = process.env.PORT || 8000;

// console.log(process.env)

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
