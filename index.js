// step: 1
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); // step: 5
require("dotenv").config();
const port = process.env.PORT || 5002;
const app = express();

// middleware, step: 2
app.use(cors());
app.use(express.json()); // parse

// from mongoDB, step: 5
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dw3v5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`; // dont forget to template string

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("emaJohn").collection("product");
    
    app.get("/product", async (req, res) => {
      console.log('query', req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = productCollection.find(query);
      let products;
      if(page || size){
        products = await cursor.skip(page*size).limit(size).toArray();
      }
      else{
        products = await cursor.toArray();
      }
      res.send(products);
    });

    app.get("/productCount", async(req, res) =>{
      const count = await productCollection.estimatedDocumentCount();
      res.send({count});
    })

    // use post to get products by ids
    app.post("/productbykeys", async(req, res) =>{
      const keys = req.body;
      const ids = keys.map(id => ObjectId(id))
      const query = {_id: {$in: ids}};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      console.log(keys);
      res.send(products);
    })

  } 
  finally {}
}
run().catch(console.dir); // step: 7

// step: 3
app.get("/", (req, res) => {
  res.send("John is waiting and running for Ema!");
}); // to create root api

// step: 4
app.listen(port, () => {
  console.log("John is running on port!", port);
});

// mongoDb steps: create database access and database user, copy data and insert,
