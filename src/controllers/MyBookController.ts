import { Request, Response } from "express";
import Book from '../models/book';
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import { create } from "domain";
import Order from "../models/order";


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

const getMyPurchases = async (req: Request, res: Response) => {
    try {
      const buyerId = req.userId;
  
      const orders = await Order.find({ user: buyerId })
                                .populate("cartItems.book")
                                .populate("user");
  
      if (!orders || orders.length === 0) {
        res.status(404).json({ message: "No purchases found" });
        return
      }
  
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching purchases" });
    }
  };
  

const getMyBookOrder = async(req: Request, res: Response) => {
    try{

        const sellerId = req.userId;

        const orders = await Order.find({"cartItems.seller": sellerId}).populate("cartItems.book").populate("user");



        if(!orders){
            res.status(404).json({message: "No orders found"});
            return
        }

        const filteredOrders = orders.map(order => {
            const sellerItems = order.cartItems.filter(
              (item: any) => item.seller.toString() === sellerId
            );
            return { ...order.toObject(), cartItems: sellerItems };
          });
      
          res.json(filteredOrders);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "error fetching the orders"});

    }

}

// const updateOrderStatus = async(req: Request, res: Response)=> {
//     try{
//         // const seller = req.userId;

//         // const {orderId, status} = req.body;

//         // const order = await Order.findById(orderId).populate("cartItems.book");

//         // if(!order){
//         //     res.status(404).json({message: "Order not found"});
//         //     return
//         // }

//         // const sellerItems = order.cartItems.filter(
//         //     (item: any) => item.seller.toString() === seller
//         // );

//         // sellerItems.forEach((item: any)=> {
//         //     item.status = status;
//         // })

//         // await order.save();


//         // res.status(200).json(order);

//         const seller = req.userId;
//     const { orderId, status } = req.body;

//     const order = await Order.findById(orderId).populate("cartItems.book");
//     if (!order) {
//       res.status(404).json({ message: "Order not found" });
//       return;
//     }

//     // Filtrar items del vendedor
//     const sellerItems = order.cartItems.filter(
//       (item: any) => item.seller.toString() === seller
//     );

//     if (sellerItems.length === 0) {
//       res.status(403).json({ message: "No items from this seller in order" });
//       return;
//     }

//     // Actualizar solo los items de ese seller
//     sellerItems.forEach((item: any) => {
//       item.status = status;
//     });

//     await order.save();

//     // Devolver SOLO los items del seller
//     const filteredOrder = {
//       _id: order._id,
//       user: order.user,
//       shippingDetails: order.shippingDetails,
//       createdAt: order.createdAt,
//       totalAmount: order.totalAmount,
//       cartItems: sellerItems, // 👈 solo los del vendedor
//     };

//     res.status(200).json(filteredOrder);


//     }catch(error){
//         console.log(error);
//         res.status(500).json({message: "Something went wrong"});
//     }

// }

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
    getMyBookOrder,
    getMyPurchases,
    // updateOrderStatus,
}