import express from "express";
import bodyParser from "body-parser";
import pg from "pg"


const app = express();

const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "luifranz2004",
  port: 5432,
});

await db.connect();


app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


let rentalcars = [];



app.get("/", async (req,res) =>{
    try {
    const result = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.img,
        r.rate,
        r.pickup_location
      FROM car c
      JOIN rental r ON c.rental_id = r.id
    `);

    console.log("index", { cars: result.rows });
  } catch (err) {
    console.error(err);
    res.send("Error loading cars");
  }

    res.render("index");
    console.log(req.body);
})


app.get("/viewitem", (req,res) =>{
    res.render("viewitem");
})


app.get("/contact", (req,res) =>{
    res.render("contact");
})



app.listen(port, ()=>{
    console.log(port);
})