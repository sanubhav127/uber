import mongoose from "mongoose";

export const connect = async ()=>{
    await mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Connected to database");
    }).catch((err)=>{
        console.log(err)
    });
}