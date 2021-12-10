const mongoose = require('mongoose');
const validator = require('validator') 
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'A name must be required']
    },
    email:{
        type:String,
        required:[true,'A name must be required'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Email must be valid']
    },
    photo:{
        type:String,
        default:'/DP.jpg'
    },
    password:{
        type:String,
        required:[true,'A password must be required'],
        minLength:8
    },
    confirmPassword:{
        type:String,
        required:[true,'A confirm password must be required'],
        validate:{
            validator:function(value){
                return value===this.password
            },
            message:'Password should match with confirmPassword'
        }
    },
    DOB:Date,
    contact:[Number,'A phone number must be required']
})

//* the following middleware runs after the validators in schema ran
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12)

    //* confirmPassword is only used till mongoose not till mongoDB
    //* below we can manipulate the object that is going to be saved
    this.confirmPassword = undefined
    //* the unique validator present in email options is an option from mongoDB itself so mongoDB also validates it after this middleware
    //* generally mongoose explicit validators are executed before pre-save hook
    //* following is not accepted by mongoDB as undefined value is already present for email field
    // this.email=undefined
    //* following is accepted from mongoDB because unique is not set
    // this.name=undefined
    next();
})

const User = mongoose.model('User',userSchema);

module.exports = User;