const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()


// Middleware
app.use(cors());
app.use(express.json());
// Enable CORS == Solve the proble 'Browser stop the fetch request or unable to fetch

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
//   
const uri = `mongodb+srv://${process.env.DB_USER}:cC9FZhNoCUaMdTug@cluster0.8cntca9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Service Collection
    const serviceCollection = client.db('servicesDB').collection('serviceCollection');

    // Bookings Collection
    const bookingCollection = client.db('bookingsDB').collection('bookingCollection');

    
    // GET 
    app.get('/services', async(req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
      console.log(result);
    })

    // GET : id = single service doc
    app.get('/services/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await serviceCollection.findOne(query);
      console.log(result);
      res.send(result)
    })

    // GET = All bookings DOC
    app.get('/bookings', async(req, res) => {
      const query = {email: req.query.email}
      
      const result = await bookingCollection.find(query).toArray();
      res.send(result)
    })

    // POST: single DOC,
    app.post('/bookings', async(req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    })

    // DELETE: Delete a DOC
    app.delete('/bookings/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await bookingCollection.deleteOne(query);
      res.send(result);

    })

    // PATCH/PUT
    app.patch('/bookings/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const data = req.body;
      const updated = {
        $set:{
          status: data.status
        }
      };
      const result = await bookingCollection.updateOne(filter, updated);
      res.send(result);
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// Get Home
app.get('/',(req, res) => {
    res.send('Wellcome to Express Server');
})

// Listener PORT
app.listen(port, () => {
    console.log(`The express server is running on the port: ${port}`);
})