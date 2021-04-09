const express = require('express');
const cors =require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9pkjs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
const port = 5000

app.use(express.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
 app.post('/addProduct', (req, res) =>{
    const products = req.body;
    console.log(products);
    productsCollection.insertOne(products)
    .then(result =>{
        res.send(result.insertedCount)
      console.log(result.insertedCount);
    })
 })
  
 app.get('/products', (req, res) =>{
   const search =req.body.search
  productsCollection.find({search:{$regex:search }})
  .toArray((err, documents) =>{
    res.send(documents);
  })
})
 app.get('/product/:key', (req, res) =>{
  productsCollection.find({key: req.params.key})
  .toArray((err, documents) =>{
    res.send(documents[0]);
  })
})
app.post('/productsByKeys',(req, res)=>{
  const productKeys = req.body;
  productsCollection.find({key:{$in:productKeys}})
  .toArray((err, documents) =>{
    res.send(documents);
  })
})
app.post('/addOrder', (req, res) =>{
  const products = req.body;
  console.log(products);
  ordersCollection.insertOne(products)
  .then(result =>{
      res.send(result.insertedCount > 0)
    console.log(result.insertedCount);
  })
})



});


// console.log(process.env.DB_PASS);
app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(process.env.PORT || port)