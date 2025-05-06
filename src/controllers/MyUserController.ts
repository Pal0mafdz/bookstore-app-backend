import { Request, Response } from "express"
import User from "../models/user";

const getCurrentUser = async (req: Request, res: Response) =>{
    try{

        //the id we are trying to find comes from de req.userId
        const currentUser = await User.findOne({_id: req.userId});
        if(!currentUser){
            res.status(404).json({message: "User not found"});
            return
        }
        //returns the current user
        res.json(currentUser);
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong!"});
        return
    }
}

const createCurrentUser = async (req: Request, res: Response) =>{

    try{
        //get the auth0 id that is going to get pass from the frontend
        //check if the user exist
        const { auth0Id } = req.body;

        //check if the user exists 
        const existingUser = await User.findOne({auth0Id})

        if(existingUser){
            //if the user exists staus is ok!
             res.status(200).send();
             return;
        }

        //passes the info to the database
        const newUser = new User(req.body);

        await newUser.save();

        //completes the req 
        res.status(201).json(newUser.toObject());


    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error creating user"});
    }
}

const updateCurrentUser = async(req: Request, res: Response)=> {
    try{

        const {name, addressLine1, country, city} = req.body;
        const user = await User.findById(req.userId);

        if(!user){
            res.status(404).json({message: "user not found"})
            return
        }

        user.name = name;
        user.addressLine1 = addressLine1;
        user.country = country;
        user.city = city;
        await user.save();

        res.send(user);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Error updating user"})
    }
}

export default {
    createCurrentUser,
    updateCurrentUser,
    getCurrentUser,
};