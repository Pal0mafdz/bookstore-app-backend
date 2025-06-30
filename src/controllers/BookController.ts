import {Request, Response } from "express"
import Book from "../models/book";

const searchBook = async(req: Request, res: Response)=>{
    try{
        const city = req.params.city;

        const searchQuery = (req.query.searchQuery as string) || "";
        const selectedGenres = (req.query.selectedGenres as string) || "";
        const sortOption = (req.query.sortOption as string) || "lastUpdated";
        //depending on what page the user is curr on, whe make a req that sends a page value to 
        //the backend will use this page number to determine how many results to return
        const page = parseInt(req.query.page as string) || 1;

        let query: any = {};
         //checks if there are any books in the city

         //regular expression london = London ok!
         query["city"] = new RegExp(city, "i");
         const cityCheck = await Book.countDocuments(query);
         if(cityCheck === 0){
            //returns an empty array bc the query is an array
            res.status(404).json({
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pages: 1,
                }
            });
            return
            
         

         }

         if(selectedGenres){
            const genresArray = selectedGenres.split(",").map((genre)=> new RegExp(genre, "i"));

            query["genres"] = { $all: genresArray};
         }

         //for each of the books in the database check name to see if it matches de 
         //book name, check if any of the genres of that book
         if(searchQuery){
            //name: The Idiot
            //genres = [Drama, True crime]
            //searchQuery = Drama
            const searchRegex = new RegExp(searchQuery, "i");
            query["$or"]=[
                {name: searchRegex},
                {genres: { $in: [searchRegex]}},
            ];
         }

         const pageSize = 20;
         const skip = (page - 1) * pageSize;
         //determien how many of the records to skip
         //it skips the first 20 elements to get to the second page

         //sortOption = lastUpdated 
         const books = await Book.find(query).sort({[sortOption]: 1}).skip(skip).limit(pageSize).lean();

         const total = await Book.countDocuments(query);

         //return pagination result
         const response = {
            data: books,
            pagination: {
                total,
                page,
                pages: Math.ceil(total/pageSize),
            }
         }

         res.json(response);

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Something went wrong"});
    }
}

export default {
    searchBook,
}