const mongoose = require('mongoose');
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
        
    },
    emailId:{
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
        // validate(value){
        //     if(validator.isEmail(value)){
        //         throw new Error("Invalid email address"+  value);
        //     }
        // }

    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter strong password"+ value);
            }
        }

    },
    age: {
        type: Number,
        min: 18,
    
    },
    gender: {
        type: String,
        validate(value){                       //this functionworks when new document is created I need to enable it in upadte iuf I want to it work
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value){
            if(validator.isURL(value)){
                throw new Error("Invalid URL address"+ value);
            }
        }
    },
    about:{
        type : String,
        default: "This is default value"
    },
    skill:{
        type: [String],
    }
}, {
    timestamps:true
});


module.exports = mongoose.model("User",userSchema);;