const Tour = require('../models/tourModel');

exports.getTopFiveCheap = async (res,req,next)=>{
    req.query.limit=5;
    req.query.sort='-ratingAvg,price';
    next()
}

exports.getAllTours =async (req,res,next)=>{
    try{
        // 1A) Filtering
        // removing page, sort etc filters
        let queryObj = {...req.query};
        const excludeKeys=['page','sort','limit','fields']
        excludeKeys.forEach(val=>{delete queryObj[val]})

        // 1B) Advanced Filtering 
        queryObj=JSON.stringify(queryObj)
        queryObj=queryObj.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)
        queryObj=JSON.parse(queryObj)

        // query can be executed by the below line too whereas for we cannot chain filter, sorts etc when directly called (using await)
        // const tours = await Tour.find(queryObj);

        const query = Tour.find(queryObj); 
        // query can be chained multiple times query.sort(); query.limit()
        
        // 2) Sorting
        if(req.query.sort){
            // console.log(req.query.sort)
            let sortStr = req.query.sort.split(',').join(' ')
            // console.log(sortStr)
            query.sort(sortStr)
        }
        else{
            query.sort('-createdAt')
        }

        // 3) Field limit
        if(req.query.fields){
            console.log(req.query.fields)
            const fieldStr = req.query.fields.split(',').join(' ')
            console.log(fieldStr)
            query.select(fieldStr);
        }
        else{
            query.select('-__v')
        }

        // 4) pagination
        if(req.query.page||req.query.limit){
            const page=req.query.page * 1 || 1;
            const limit = req.query.limit * 1 || 100
            const skip = (page-1)*limit
            query.skip(skip).limit(limit)
            const totDocs = await Tour.countDocuments()
            if(skip>=totDocs) {
                throw new Error('Page No exceed total docs')
            }
        }

        // N) Execute the query
        const tours= await query

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