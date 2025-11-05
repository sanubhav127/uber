import Captain from "../models/captain.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const {fullname, email, password, vehicle} = req.body;
    try {
        if(!fullname || !password || !email || !vehicle){
            return res.status(400).json({message : "All fields are mandatory!"});
        }

        const captain = await Captain.findOne({email});
        if(captain){
            return res.status(409).json({message : "Person already exists"});
        }

        const genSalt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, genSalt);

        const newCaptain = new Captain({
            fullname,
            email,
            password : hashPassword,
            
            vehicle : {
            color : vehicle.color,
            capacity : vehicle.capacity,
            plate : vehicle.plate,
            vehicleType : vehicle.vehicleType
            }
        });

        await newCaptain.save();

        const token = jwt.sign({_id : newCaptain._id, email : newCaptain.email}, process.env.JWT_SECRET, {expiresIn : "7d"});

        res.cookie("token" , token, {
        httpOnly : true,
        sameSite : "strict",
        secure : false,
        maxAge : 7*24*60*60*1000
       });

       res.status(201).json({message : "Captain registered successfully!"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const captain = await Captain.findOne({email}).select("+password")
        if(!captain){
            return res.status(401).json({message : "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, captain.password);
        if(!isMatch){
            return res.status(401).json({message : "Invalid email or password"});
        }

        const token = jwt.sign({_id : captain._id, email : captain.email}, process.env.JWT_SECRET, {expiresIn : "7d"});
        res.cookie("token" , token, {
        httpOnly : true,
        sameSite : "strict",
        secure : false,
        maxAge : 7*24*60*60*1000
       });

       res.json({ message: "Login successful!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });   
    }
};

export const logout = (req, res) => {
     try {
        res.clearCookie("token", {
            httpOnly: true,
            secure : false,
            sameSite : "strict",
            maxAge : 0
        });

        res.json({message : "Logged Out successfully!"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getProfile = (req, res) => {
    res.status(200).json({captain : req.captain});
}