const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures')

exports.getTopFiveCheap = async (req,res,next)=>{
    req.query={}
    req.query.limit=5;
    req.query.sort='-ratingAvg,price';
    req.query.fields='name,ratingAvg,price'
    next()
}


exports.getAllTours =async (req,res,next)=>{
    try{
       
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
    }
    catch(err){
        console.log(err)
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}

exports.getTour = async (req,res,next)=>{
    try{
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status:"success",
            data:{
                tour
            }
        })
    }
    catch(err){
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}


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

exports.editTour = async (req,res)=>{
    try{
        const newTour = await Tour.findByIdAndUpdate(req.body.id,req.body,{
            new:true,
            runValidators:true
        });
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
        await Tour.findByIdAndDelete(req.params.id);
        // console.log(tour)
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

exports.getTourStats = async (req,res)=>{
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

exports.getMonthlyPlan = async (req,res)=>{    
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