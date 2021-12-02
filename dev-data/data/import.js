const mongoose = require('mongoose');
const dotenv= require('dotenv')
const fs= require('fs')
const Tour = require('../../models/tourModel')

dotenv.config({path:'./config.env'})
const DB= process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);

const tours= JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));

const importData = async ()=>{
    try{
        await Tour.create(tours)
    }
    catch(err){
        console.log(err)
    }
    console.log('import done!')
    mongoose.disconnect();
}

const deleteData = async ()=>{
    try{
        await Tour.deleteMany()
    }
    catch(err){
        console.log(err)
    }
    console.log('deletion done!')
    mongoose.disconnect();
}

// console.log(process.argv);

const runScript= ()=>{
    if(process.argv[2]==='--import') {
        importData()
    }
    else if(process.argv[2]==='--delete') {
        deleteData()
    }
    
}



mongoose.connect(DB,{
    useNewUrlParser:true,
    useFindAndModify:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})
.then(()=>{
    console.log('DB connected in import.js')
    runScript()
})
.catch(err=>{
    console.log(err)
})