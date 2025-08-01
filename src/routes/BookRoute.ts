import express from "express";
import { param } from "express-validator";
import BookController from "../controllers/BookController";
//import BookController
const router = express.Router();

// /api/book/search/london
router.get("/search/:city", param("city").isString().trim().notEmpty().withMessage("City parameter must be a valid string"),
BookController.searchBook
);

//get the book
router.get("/:bookId", param("bookId").isString().trim().notEmpty().withMessage("BookId parameter must be a valid string"),
BookController.getBook);

export default router;