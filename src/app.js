import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({limit: "16kb"}))//accepting json, json in configured ; form is filled we got data
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.usea(cookieParser())

export {app}