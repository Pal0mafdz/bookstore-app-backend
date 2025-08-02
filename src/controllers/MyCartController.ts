import { Request, Response } from "express";
import Book from "../models/book";
import Cart from "../models/cart";


const addMyCart = async(req: Request, res: Response)=>{
    try{
        //get user Id 
        const userId = req.userId;
        const { bookId, quantity } = req.body;

        const book = await Book.findById(bookId);

        if(!book){
            res.status(404).json({message: "Book not found"});
            return
        }
        let cart = await Cart.findOne({user: userId});

        //if cart doesnt exist, create a new cart
        if(!cart){
            cart = new Cart({
                user: userId,
                items: [{book: bookId, quantity}],
            })
        }else{
            const itemIndex = cart.items.findIndex((item)=> item.book.toString() === bookId);


            //if it finds a book, just sum the quantity
            if(itemIndex > -1){
                cart.items[itemIndex].quantity += quantity;
            }else{
                //pushes a new book
                cart.items.push({ book: bookId, quantity});
            }

        }
        await cart.save();
        res.status(200).json(cart);


    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});


    }

}

const deleteFromMyCart = async(req: Request, res: Response) =>{
    try{
        const userId = req.userId;
        const { bookId } = req.params;

        const cart = await Cart.findOne({user: userId});

        if(!cart){
            res.status(404).json({message: "Cart not found"});
            return
        }
        cart.items.pull({ book: bookId });

        await cart.save();
        res.status(200).json(cart);
        
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }

}

const getMyCart = async(req: Request, res: Response) =>{

    try{
    const userId = req.userId;
    const cart = await Cart.findOne({user: userId}).populate("items.book");

    if(!cart){
        res.status(200).json({ items: [] });
        return
    }
    res.status(200).json(cart);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});    
    }


}

export default{
    addMyCart,
    deleteFromMyCart,
    getMyCart,
}


