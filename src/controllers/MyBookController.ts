import { Request, Response } from "express";
import Book from '../models/book';
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import { create } from "domain";


// const getMyBook = async(req: Request, res: Response) =>{
//     try{
//         const book = await Book.findOne({user: req.userId});
//         if(!book){
//             res.status(404).json({message: "book not found"});
//             return
//         }
//         res.status(200).json(book);
//         // return


//     }catch(error){
//         console.log(error);
//         res.status(500).json({message: "error fetching book"})
//     }
// }

const getMyBookById = async(req: Request, res: Response)=>{
    try{
        const book = await Book.findOne({user: req.userId, _id: req.params.id, })

        if(!book){
            res.status(404).json({message: "book not found"})
            return
        }
        res.status(200).json(book);
        return

    }catch(error){
        console.log(error);
        res.status(500).json({message: "error fetching the book"})

    }
}

const getMyBooks = async(req: Request, res: Response) =>{
    try{
        const books = await Book.find({user: req.userId});
        // if(!books){
        //     res.status(404).json({message: "books not found"})
        // }
        res.status(200).json(books);
        // return
    }catch(error){
        console.log(error);
        res.status(500).json({message: "error fetching the books"})
    }
}

const deleteMyBook = async(req: Request, res: Response)=>{
    try{

        const book = await Book.findOneAndDelete({user: req.userId, _id: req.params.id,});

        if(!book){
            res.status(404).json({ message: "Book not found" });
            return
        }
        res.status(200).json(book);
        return


    }catch(error){
        console.log(error);
        res.status(500).json({message: "error deleting the book"})

    }
}

const updateMyBook = async (req: Request, res: Response)=>{
    try{

        const book = await Book.findOne({
            user: req.userId,
            _id: req.params.id
        });

        if(!book){
            res.status(404).json({ message: "Book not found"});
            return
        }

        book.name = req.body.name;
        book.city = req.body.city;
        book.country = req.body.country;
        book.shippingCost = req.body.shippingCost;
        book.price = req.body.price;
        book.author = req.body.author;
        book.condition = req.body.condition;
        book.genres = req.body.genres;
        book.estimatedShippingTime = req.body.estimatedShippingTime;
        book.description = req.body.description;
        book.lastUpdated = new Date();

        if(req.file){
             const imageUrl = await uploadImage(req.file as Express.Multer.File)
             book.imageUrl = imageUrl;
        }
        await book.save();
        res.status(200).send(book);

    }catch(error){
        console.log("error", error);
        res.status(500).json({message: "Something went wrong"});
    }
}


const createMyBook = async (req: Request, res: Response) =>{
    try{
        const { name } = req.body;
        //const existingShop = await Shop.find({ user: req.userId});
        const existingBook = await Book.findOne({ user: req.userId, name: name});

        if(existingBook){
            res.status(409).json({message: "You already upload a book with this name"});
            return
        }

        //handles the image 
        // const image = req.file as Express.Multer.File;
        // const base64Image = Buffer.from(image.buffer).toString("base64");
        // const dataURI = `data:${image.mimetype};base64,${base64Image}`;

        // const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

        const imageUrl = await uploadImage(req.file as Express.Multer.File)

       
        const book = new Book(req.body);
        book.imageUrl = imageUrl;
        book.user = new mongoose.Types.ObjectId(req.userId)
        book.lastUpdated = new Date();
        await book.save();

        res.status(201).send(book);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}

const uploadImage = async (file: Express.Multer.File) =>{
        const image = file;
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;

        const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
        return uploadResponse.url;

}

export default{
    getMyBooks,
    createMyBook,
    updateMyBook,
    deleteMyBook,
    getMyBookById,
}