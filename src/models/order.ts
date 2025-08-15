import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
    book: {type: mongoose.Schema.Types.ObjectId, ref: "Book"},
    name: {type: String, required: true},
    quantity:{type: Number, required: true, default:1},
    seller: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 

})

const orderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    shippingDetails: {
        email: {type: String, required: true},
        name: {type: String, required: true},
        addressLine1: {type: String, required: true},
        city: {type: String, required: true},

    },
    cartItems: [cartItemSchema],
    totalAmount: Number,
    status: {
        type: String,
        enum: ["placed", "paid", "processing", "shipped", "outForDelivery", "delivered"],
    },
    createdAt: {type:Date, default: Date.now},
    
})

const Order = mongoose.model("Order", orderSchema);
export default Order;