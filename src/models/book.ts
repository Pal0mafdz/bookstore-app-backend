 import mongoose from "mongoose"

// const BookSchema = new mongoose.Schema({
//     name: {type: String, required: true},
//     price: {type: Number, required: true},
//     genres: [{type: String, required: true}],
//     description: {type:String, required:true},
//     author:{type: String},
//     condition: { type: String, enum: ['new', 'like new', 'very good', 'good', 'acceptable'], required: true },
//     imageUrl: {type: String,required:true},
// })


const BookSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: { type: String, required: true},
    price: {type: Number, required: true},
    genres: [{type: String, required: true}],
    description: {type:String, required:true},
    author:{type: String},
    city: { type: String, required: true},
    country: { type: String, required: true},
    shippingCost: { type: Number, required: true},
    estimatedShippingTime: { type: Number, required: true},
    imageUrl: {type: String, required:true},
    condition: { type: String, enum: ['new', 'like new', 'very good', 'good', 'acceptable'], required: true },
    lastUpdated: {type: Date},
})

const Book = mongoose.model("Book", BookSchema);
export default Book;


