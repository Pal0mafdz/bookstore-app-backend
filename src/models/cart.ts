import mongoose from "mongoose";
import Book from "./book";

const cartItemSchema = new mongoose.Schema({
    book:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", 
        required: true,
    },
    quantity:{
        type: Number,
        required:true,
        default: 1,
    },

})

const cartSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true, 
        unique: true,
    },

    items: [cartItemSchema],


})

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
