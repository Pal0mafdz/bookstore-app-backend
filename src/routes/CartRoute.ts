import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import MyCartController from "../controllers/MyCartController";


const router = express.Router();

router.post("/", jwtCheck, jwtParse, MyCartController.addMyCart);
router.delete("/:bookId", jwtCheck, jwtParse, MyCartController.deleteFromMyCart);
router.get("/", jwtCheck, jwtParse, MyCartController.getMyCart);

export default router;
