import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());



// sample data base
let rentalcars = [
    {
        "car_name": "Mitsubishi 3000GT",
        "price": 0,
        "ownder_details": {
            "owner_name": "name",
            "age": 0,
            "address": "address",
            "contact": 63 + "+",
            "socials": [
            ]
        }
        
    }
    // another car 
]


app.get("/", (req,res) =>{
    res.render("index");
})


app.get("/viewitem", (req,res) =>{
    res.render("viewitem");
})


app.listen(port, ()=>{
    console.log(port);
})