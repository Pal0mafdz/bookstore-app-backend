import express from "express";
import multer from "multer";
import MyBookController from "../controllers/MyBookController";
import { jwtCheck, jwtParse } from "../middleware/auth"; //ensures that we got a valid token
import { validateMyBookRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024, //5mb
    }
})

// /api/my/book 
//jwtParse pulls the curr loged in user to get their info out of the token and passes it to the request
//router.post("/",upload.single("imageFile"),validateMyBookRequest, jwtCheck,jwtParse, MyBookController.createMyBook);


// router.post(
//     "/",
//     jwtCheck, // ✅ Primero valida el token
//     jwtParse, // ✅ Luego extrae el userId
//     upload.single("imageFile"),
//     validateMyBookRequest,
//     MyBookController.createMyBook
//   );
  
//GET api/my/book
router.get("/", jwtCheck, jwtParse, MyBookController.getMyBook)

router.post(
    "/",
    upload.single("imageFile"),
    validateMyBookRequest,
    jwtCheck,
    jwtParse,
    MyBookController.createMyBook
  );

  router.put("/", upload.single("imageFile"),
  validateMyBookRequest,
  jwtCheck,
  jwtParse,
  MyBookController.updateMyBook
);
export default router;