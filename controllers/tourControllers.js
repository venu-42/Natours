const fs= require('fs');

const tours= JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`));

exports.checkID = (req,res,next,val)=>{
    const id =req.params.id *1;
    let index;
    const tour= tours.find((el,i)=>{
        index=i;
        return el.id===id
    });

    if(!tour){
        return res.status(404).json({
            status:"fail",
            message:"invalid ID"
        })
    }
    req.new_params= {id:index};
    next();
}

exports.getAllTours = (req,res,next)=>{
    console.log(req.requestTime)
    res.status(200).json({
        "status":"success",
        requestedAt:req.requestTime,
        "results":tours.length,
        "data": {
            tours
        }
    })
}

exports.getTour = (req,res,next)=>{
    const newId =req.new_params.id;

    res.status(200).json({
        status:"success",
        data:{
            tour:tours[newId]
        }
    })
}

exports.checkBeforeAddTour = (req,res,next)=>{
    const {name,duration,difficulty,guides,price} = req.body;
    
    if(name&&duration&&difficulty&&guides&&price){
        // if(typeof name !=="string"){}
        console.log("validation done and tour data can be added")
    }
    else {
        return res.status(400).json({
            status:"fail",
            message:"data not valid"
        })
    }
    next();
}

exports.addTour = (req,res,next)=>{
    console.log(req.body);
    // res.send('received MF')
    const id= tours[tours.length-1].id +1;
    const newTour= req.body;
    newTour.id=id;

    tours.push(newTour);
    fs.writeFile(`${__dirname}/../dev-data/data/tours.json`,JSON.stringify(tours),err=>{
        if(err) {
            console.log(err);
            res.status(400).json({
                status:"internal server err"
            })
        }
        else{
            res.status(201).json({
                status:"created",
                data:{
                    tour:newTour
                }
            })
        }
    })
}

exports.editTour = (req,res)=>{
    const newId =req.new_params.id;

    for(let key in req.body){
        if(tours[newId][key]) tours[newId][key]= req.body[key];
    }
    fs.writeFile(`${__dirname}/../dev-data/data/tours.json`,JSON.stringify(tours),(err)=>{
        if(err) {
            res.status(404).json({
                status:"fail",
                message:err
            })
            return;
        }
        res.status(200).json({
            status:"success",
            data:{
                tour:tours[newId]
            }
        })
    }) 
    
    // console.log("patch completed",tours[index]);
}

exports.deleteTour = (req,res,next)=>{
    const newId =req.new_params.id;
    
    tours.splice(newId,1);
    fs.writeFile(`${__dirname}/../dev-data/data/tours.json`,JSON.stringify(tours),err=>{
        res.status(204).json({
            status:"success",
            data:null
        })
    })
        
}