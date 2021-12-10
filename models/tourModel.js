const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    name:{
      type:String,
      required: [true,'A tour must have a name'],
      maxLength:25,
      unique:true,
      trim:true
    },
    duration:{
      type:Number,
      required:[true,'A tour must have a duration'],
      max:30
    },
    maxGroupSize:{
      type:Number,
      required:[true,'A tour must have a group size']
    },
    difficulty:{
      type:String,
      required:[true,'A tour must have a difficulty'],
      enum:['easy','medium','hard']
    },
    ratingAvg:{
      type:Number,
      default:4.5,
      min:1,
      max:5
    },
    ratingQuantity:{
      type:Number,
      default:0
    },
    price:{
      type:Number,
      required:[true,'A tour must have a price']
    },
    priceDiscount:Number,
    summary:{
      type:String,
      trim:true,
      required:[true,'A tour must have a summary']
    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type:String,
      required:[true,'A tour must have a image cover']
    },
    images:[String],
    createdAt:{
      type:Date,
      default:Date.now()
    },
    startDates:[Date],
    secretTour:{
      type:Boolean,
      default:false
    }
  },{
    // to be able to see virtuals in actual output
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

// virtual field. It just shows up after mongoose renders it. Not actualy stored in Mongodb
tourSchema.virtual('DurationWeeks').get(function(){
  return this.duration/7;
})

// Middlewares

// 1) Document middleware. 
//runs on save(), create() mongoose fns not for insertMany()
tourSchema.pre('save',function(next){
  console.log('saving doc!!')
  next()
})

tourSchema.post('save',function(doc,next){
  //! this represents the document object
  console.log('just now saved!😊')
  next();
})

// 2) query Middleware
// below regualr expression is used to cover all the find queries ex: find, findOne, findOneandUpdate etc
tourSchema.pre(/^find/,function(next){
  //! this represents the query object
  this.find({secretTour:{$ne:true}})
  console.log('secretTours filtered out😁')
  next()
})

// 3) Aggregate Middlewares



const Tour = mongoose.model('Tour',tourSchema);

module.exports = Tour;
  