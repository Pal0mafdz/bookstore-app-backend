import express from "express";
import { param } from "express-validator";
import BookController from "../controllers/BookController";
//import BookController
const router = express.Router();

// /api/book/search/london
router.get("/search/:city", param("city").isString().trim().notEmpty().withMessage("City parameter must be a valid string"),
BookController.searchBook
);

export default router;