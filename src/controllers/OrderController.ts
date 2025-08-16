import { Request, Response } from "express"
import Stripe from "stripe";
import Book from "../models/book";
import Order from "../models/order";
import Cart from "../models/cart";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string

type CheckoutSessionRequest={
    cartItems:{
        bookId: string;
        quantity: number;
        
        
        
    }[];
deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string
  };
  


}

const createCheckoutSession = async(req: Request, res: Response): Promise<void>=>{
    try{
        const { cartItems, deliveryDetails }: CheckoutSessionRequest = req.body;

        //map every id of the books inside the cart

        const bookIds = cartItems.map(item => item.bookId);

        //search all books inside the cart
        const books = await Book.find({_id: {$in: bookIds}});

        if(books.length === 0){
            res.status(404).json({message: "Books not found"});
            return
        }

        const itemswithDetails = cartItems.map(item =>{
            const book = books.find(b => b._id.toString() === item.bookId);
            return{
                book: book?.id,
                name: book?.name,
                quantity: item.quantity,
                price: book?.price,
                shippingCost: book?.shippingCost,
                seller: book?.user,
            }
        })

        const totalShippingCost = itemswithDetails.reduce((sum, item)=> {
            return sum + (item.shippingCost || 0);
        }, 0);

        const newOrder = new Order({
            
            user: req.userId,
            status: "placed",
            shippingDetails: deliveryDetails,
            cartItems: itemswithDetails.map(item => ({
                book: item.book,
                name: item.name,
                quantity: item.quantity,
                seller: item.seller,

            })),
            createdAt: new Date(),
        })

        await newOrder.save();
        //deletes cart after creating an order
        await Cart.findOneAndDelete({user: req.userId});

        const line_items = itemswithDetails.map((item)=> ({
            price_data:{
                currency: "usd",
                unit_amount: Math.round(item.price|| 0),
                product_data: {
                    name: item.name || "unamed book",
                },  
            },
            quantity: item.quantity,
        }));

        const session = await STRIPE.checkout.sessions.create({
            mode: "payment",
            line_items,
            metadata:{
                orderId: newOrder._id.toString(),
                sellers: JSON.stringify(itemswithDetails.map(item => item.seller?.toString())),

            },
            payment_intent_data: {
                metadata: {
                  orderId: newOrder._id.toString(),
                  sellers: JSON.stringify(itemswithDetails.map(item => item.seller?.toString())),
                },
            },
            shipping_address_collection:{
                allowed_countries: ["MX", "US"],
            },
            shipping_options:[
                {
                    shipping_rate_data:{
                        type: "fixed_amount",
                        fixed_amount:{
                            amount: Math.round(totalShippingCost || 0),
                            currency: "usd",
                        },
                        display_name: "Shipping Cost",
                    },
                },
            ],
            // customer_email: deliveryDetails.email,
            success_url: `${FRONTEND_URL}/order-status?success=true`,
            cancel_url: `${FRONTEND_URL}/cancelled=true`,
        });

        if(!session.url){
            res.status(500).json({message: "error creating stripe session"});
            return;
        }

        
        res.json({ url: session.url});
        

    }catch(error: any){
        console.log(error);
        res.status(500).json({message: error.raw.message});
    }

}


export default {
    createCheckoutSession,
};
