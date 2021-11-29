const Tour = require('../models/tourModel');

exports.getAllTours =async (req,res,next)=>{
    try{
        const tours = await Tour.find();
        res.status(200).json({
            status:"success",
            results:tours.length,
            data:tours
        })
    }
    catch(err){
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
        res.status(404).json({
            status:"fail",
            message:err
        })
    }
}