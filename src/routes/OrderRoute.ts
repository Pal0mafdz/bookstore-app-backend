
import OrderController from '../controllers/OrderController';
import { jwtCheck, jwtParse } from '../middleware/auth'
import express from "express";

const router = express.Router();

// router.post("/checkout/create-checkout-session", jwtCheck, jwtParse, OrderController );

router.get("/", jwtCheck, jwtParse, OrderController.getMyOrders);
router.post("/checkout/create-checkout-session", jwtCheck, jwtParse, OrderController.createCheckoutSession);
router.post("/checkout/webhook", OrderController.stripeWebhookHandler);

export default router;