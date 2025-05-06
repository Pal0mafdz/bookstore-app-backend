import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import MyUserRoute from './routes/MyUserRoute';
//import myUserRoute from "./routes/MyUserRoutes";

//cast
mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).
then(() => console.log("Connected to database!!"))

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

app.listen(8000, () =>{
    console.log("server started on localhost:8000");
});