import mongoose from "mongoose";

const captainSchema = new mongoose.Schema({
    fullname : {
      type : String,
      required : true,
      minlength : 3
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    password : {
        type : String,
        required : true,
        minlength : 6,
        select : false
    },
    socketId : {
        type : String
    },
    status : {
        type : String,
        enum : ['active' , 'inactive'],
        default : "inactive"
    },
    vehicle : {
        color : {
            type : String,
            required : true,
            minlength : [3, "Color must be at least 3 characters long"]
        },
        plate : {
            type : String,
            required : true,
            minlength : [9 , "Number must be at least 9 characters long"]
        },
        capacity : {
            type : Number,
            required : true
        },
        vehicleType : {
            type : String,
            required : true,
            enum : ["rickshaw" , "car", "bike"]
        }
    },
    location : {
        latitude : {
            type : Number
        },
        longitude : {
            type : Number
        }
    }
}, {timestamps : true});

const Captain = mongoose.model("Captain", captainSchema);

export default Captain;