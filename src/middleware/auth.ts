import {auth} from 'express-oauth2-jwt-bearer'
import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken';
import  User from '../models/user'

declare global{
  namespace Express{
    interface Request{
      userId: string;
      auth0Id: string;
    }

  }
}

//function from the auth0 that connects to the auth0 based on the credentials we use when we 
//create an acc, it validates if the token that we get from the req is from auth0

//jwtParse pick the acces token and get some info out of it
export const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUE_BASE_URL,
    tokenSigningAlg: 'RS256'
  });
  
  //get acces token from the authorization header from the request
  export const jwtParse = async(req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    //whenever we send a req we have a header field named Bearer
    if(!authorization || !authorization.startsWith("Bearer ")){
      res.sendStatus(401);
      return
    }

    //if we do have a valid authorization header ->
    //get the token from the authorization string
    // Bearer 17838y41396948179  -> we need to split the string and the [1] is t
    //to get the token and asign it to the token variable 
    const token = authorization.split(" ")[1];

    //we need to decode the token to get the auth0Id
    //search on the databse
    try{
      const decoded = jwt.decode(token) as jwt.JwtPayload;
      const auth0Id = decoded.sub;
      const user = await User.findOne({auth0Id});

      if(!user){
        res.sendStatus(401);
        return
      }

      req.auth0Id = auth0Id as string;
      req.userId = user._id.toString();
      next();


    }catch(error){
      res.sendStatus(401);
      return
    }

  }