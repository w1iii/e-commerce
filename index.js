import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.get("/", (req,res) =>{
    res.render("index");
})


app.get("/viewitem", (req,res) =>{
    res.render("viewitem");
})


app.listen(port, ()=>{
    console.log(port);
})