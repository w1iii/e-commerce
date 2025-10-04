import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

// Database configuration
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "QuickR",
  password: "luifranz2004",
  port: 5432,
});

// Connect to database
db.connect()
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection error:", err));

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Homepage - Display all available cars
app.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.model,
        c.image_url,
        r.rate_per_day,
        r.pickup_location,
        r.security_deposit,
        r.fuel_policy,
        r.availability
      FROM cars c
      JOIN rental_details r ON c.id = r.car_id
      WHERE r.availability = true
      ORDER BY c.name
    `);

    console.log("Cars loaded:", result.rows.length);
    res.render("index", { cars: result.rows || [] });
  } catch (err) {
    console.error("Error loading cars:", err.message);
    console.error("Error details:", err);
    // Render page with empty cars array instead of showing error
    res.render("index", { cars: [] });
  }
});

// View specific car details with owner information
app.get("/viewitem/:id", async (req, res) => {
  const carId = req.params.id;
  
  try {
    const result = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.model,
        c.image_url,
        c.description,
        r.rate_per_day,
        r.pickup_location,
        r.security_deposit,
        r.fuel_policy,
        r.availability,
        o.name as owner_name,
        o.age as owner_age,
        o.address as owner_address,
        o.contact as owner_contact,
        o.facebook as owner_facebook,
        o.instagram as owner_instagram,
        o.profile_image as owner_profile_image
      FROM cars c
      JOIN rental_details r ON c.id = r.car_id
      JOIN owners o ON c.owner_id = o.id
      WHERE c.id = $1
    `, [carId]);

    if (result.rows.length === 0) {
      return res.status(404).send("Car not found");
    }

    res.render("viewitem", { car: result.rows[0] });
  } catch (err) {
    console.error("Error loading car details:", err);
    res.status(500).send("Error loading car details");
  }
});

// Contact page
app.get("/contact", (req, res) => {
  res.render("contact");
});

// Create a booking
app.post("/book", async (req, res) => {
  const { car_id, customer_name, customer_email, customer_phone, rental_start, rental_end } = req.body;
  
  try {
    await db.query(`
      INSERT INTO bookings (car_id, customer_name, customer_email, customer_phone, rental_start, rental_end, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
    `, [car_id, customer_name, customer_email, customer_phone, rental_start, rental_end]);

    res.json({ success: true, message: "Booking request submitted successfully" });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ success: false, message: "Error creating booking" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});