import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async(req: Request, res: Response, next: NextFunction) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()});
        return;
    }
    next();

}

export const validateMyUserRequest = [
    body("name").isString().notEmpty().withMessage("Name must be a string"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string"),
    body("city").isString().notEmpty().withMessage("City must be a string"),
    body("country").isString().notEmpty().withMessage("Country must be a string"),
    handleValidationErrors,
];

export const validateMyBookRequest = [
    body("name").notEmpty().withMessage("Name is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("genres").isArray().withMessage("Genres must be an array").notEmpty().withMessage("Genres cant be empty"),
    body("description").notEmpty().withMessage("Descriptionis re quired"),
    body("author").notEmpty().withMessage("Author is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("shippingCost").isFloat({ min: 0 }).withMessage("shipping price must be a positive number"),
    body("estimatedShippingTime").isInt({ min: 0 }).withMessage("Estimated shipping time must be a positive integer"),
    handleValidationErrors,

];