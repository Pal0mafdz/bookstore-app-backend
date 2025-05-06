import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from '../middleware/auth'
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

//get the token
//parse the token so we can get the id with jwtParse
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);
//if we get a req with "/api/my/user" the handler us going to
//pass the req on MyUser...
router.post("/",jwtCheck, MyUserController.createCurrentUser);
//endpoint that checks that pur user is loged in and has an acces token, checks if the user exists and validates
router.put("/", jwtCheck, jwtParse, validateMyUserRequest ,MyUserController.updateCurrentUser);
//add validation to the req above on middleware



export default router;