const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

const [reviews] = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const [dealerships] = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

mongoose.connect("mongodb://mongo_db:27017/",{'dbName':'dealershipsDB'});


const Reviews = require('./review');

const Dealerships = require('./dealership');
const dealership = require('./dealership');

try {
  Reviews.deleteMany({}).then(()=>{
    Reviews.insertMany(reviews);
  });
  Dealerships.deleteMany({}).then(()=>{
    Dealerships.insertMany(dealerships);
  });
  
} catch (error) {
  res.status(500).json({ error: 'Error fetching documents' });
}


// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({dealership: req.params.id});
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
    try {
        const documents = await Dealerships.find({state: req.params.state});
        res.json(documents);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
      }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const documents = await Dealerships.find({id: req.params.id});
        res.json(documents);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
      }
});

//Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  [
    name,
    dealership_data=dealership,
    review_data=review,
    purchase,
    purchase_date,
    car_make,
    car_model,
    car_year
  ] = JSON.parse(req.body);
  const documents = await Reviews.find().sort( { id: -1 } );
  let [id] = documents[0];
  let new_id = id+1;

  const reviewModel = new Reviews({
		id: new_id,
		name,
		dealership: dealership_data,
		review: review_data,
		purchase,
		purchase_date,
		car_make,
		car_model,
		car_year,
	});

  try {
    const savedReview = await reviewModel.save();
    res.json(savedReview);
  } catch (error) {
		console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
