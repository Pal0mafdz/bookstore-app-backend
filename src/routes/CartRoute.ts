import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import MyCartController from "../controllers/MyCartController";


const router = express.Router();

router.post("/cart", jwtCheck, jwtParse, MyCartController.addMyCart);
router.delete("/cart:bookId", jwtCheck, jwtParse, MyCartController.deleteFromMyCart);

export default router;
