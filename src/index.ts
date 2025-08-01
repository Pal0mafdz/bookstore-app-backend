import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import MyUserRoute from './routes/MyUserRoute';
import { v2 as cloudinary } from 'cloudinary';
import MyBookRoute from "./routes/MyBookRoute";
import BookRoute from "./routes/BookRoute";
import CartRoute from "./routes/CartRoute";
//import myUserRoute from "./routes/MyUserRoutes";

//cast
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).
then(() => console.log("Connected to database!!"))

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})
// mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
// .then(()=>console.log("Connected to database"));


const app = express();
app.use(express.json()); 
app.use(cors());

//deploy
app.get("/health", async(req: Request, res: Response)=>{
    res.send({message: "health OK!"});
});

app.use("/api/my/user", MyUserRoute);
app.use("/api/my/book", MyBookRoute);
app.use("/api/book", BookRoute);
app.use("/api/cart", CartRoute);

app.listen(8000, () =>{
    console.log("server started on localhost:8000");
});