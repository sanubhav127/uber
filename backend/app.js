import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { connect } from "./src/db/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/user.routes.js";
import capRoutes from "./src/routes/captain.routes.js";
import mapRoutes from "./src/routes/maps.route.js";

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/user", userRoutes);
app.use("/captain", capRoutes);
app.use("/api", mapRoutes);

server.listen(PORT, ()=>{
    console.log(`Server is running on Port : ${PORT}`);
    connect();
});