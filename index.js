const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3017


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.dsz3qaf.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   //  await client.connect();
   const laptopCollection = client.db('laptopDB').collection('laptops')
   // CRUD oparation part 

         app.get('/laptop', async (req,res) => {
            const allLaptop = await laptopCollection.find().toArray()
            console.log(allLaptop);
            res.send(allLaptop)
         })
         app.get('/laptop/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const findData = await laptopCollection.findOne(query)
            console.log(findData);
            res.send(findData)
         })
         app.post('/laptop', async (req, res) => {
            const postLaptop = req.body;
            console.log(postLaptop);
            const result = await laptopCollection.insertOne(postLaptop)
            console.log(result);
            res.send(result)
         })
         app.put('/laptop/:id', async(req,res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const option = {upsert : true}
            const data = req.body
            const  updateData = {
               $set : {
                  name : data.name,
                   brand : data.brand, 
                   price : data.price,
                   select : data.select,
                   description : data.description,
                   rating : data.rating,
                   photo : data.photo
               }
            }
            const result = await laptopCollection.updateOne(filter,updateData, option)
            res.send(result)
         })
         app.delete('/laptop/:id', async (req,res) => {
            const id = req.params.body;
            const query = {_id : new ObjectId(id)}
            const result = await laptopCollection.deleteOne(query)
            console.log(result);
            res.send(result)

         })


 
   //  await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => res.send('Server Brows is running'))
app.listen(port, () => console.log(`Server port is Running ${port}`))