const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getTopFiveCheap = async (req,res,next)=>{
    req.query={}
    req.query.limit=5;
    req.query.sort='-ratingAvg,price';
    req.query.fields='name,ratingAvg,price'
    next()
}

const catchAsync = fn => {
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}


exports.getAllTours =catchAsync(async (req,res,next)=>{
    const features = new APIFeatures(Tour.find(),req.query)

    features
    .filter()
    .sort()
    .fields()
    .pagination()

    const tours= await features.query

    res.status(200).json({
        status:"success",
        results:tours.length,
        data:tours
    })
})

exports.getTour = catchAsync(async (req,res,next)=>{
    const tour = await Tour.findById(req.params.id);

    if(!tour){
        return next(new AppError('Tour not found',404))
    }

    res.status(200).json({
        status:"success",
        data:{
            tour
        }
    })
})


exports.addTour = async (req,res,next)=>{
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status:"created",
            data:{
                tour:newTour
            }
        })        
    }
    catch(err){
        res.status(400).json({
            status:'fail',
            message:'invalid'
        })
    }
}

exports.editTour = async (req,res,next)=>{
    try{
        const newTour = await Tour.findByIdAndUpdate(req.body.id,req.body,{
            new:true,
            runValidators:true
        });

        //! mongoose don't give a error here because ID is valid and only the tour is not found. hence we need to explicilty call for error
        //! this can also be done in the way done in getTour controller above
        if(!newTour){
            return next(new AppError('Tour not found',404))
        }
        res.status(201).json({
            status:"created",
            data:{
                tour:newTour
            }
        })        
    }
    catch(err){
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
}

exports.deleteTour = async (req,res,next)=>{
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id);

        //! mongoose dont give an error for following
        if(!tour){
            return next(new AppError('Tour not found',404))
        }

        res.status(204).json({
            status:"success",
            data:null
        })
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        })
    }
}

exports.getTourStats = async (req,res,next)=>{
    try{
        const tours= await Tour.aggregate([
            {
                $match:{}
            },
            {
                $group:{
                    _id:'$difficulty',
                    maxPrice:{
                        $max:'$price'
                    },
                    minPrice:{
                        $min:'$price'
                    },
                    coutn:{
                        $sum:1
                    }
                }
            }
        ])
        res.status(200).json({
            status:"success",
            results:tours.length,
            tours
        })
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        })
    }
}

exports.getMonthlyPlan = async (req,res,next)=>{    
    try{
        const year = req.params.year *1
        const tours = await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match:{
                    startDates:{
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }                
                }
            },
            {
                $group:{
                    _id:{$month:'$startDates'},
                    toursCount:{$sum:1},
                    tours:{$push:'$name'}
                }
            },
            {
                $addFields:{
                    month:'$_id'
                }
            },
            {
                $project:{_id:0}
            },
            {
                $sort:{
                    toursCount:-1,
                    _id:1
                }
            },
            {
                $limit:5
            }
        ])
        
        res.status(200).json({
            status:"success",
            results:tours.length,
            tours
        })
    }
    catch(err){
        res.status(400).json({
            status:"fail",
            message:err
        })
    }
}