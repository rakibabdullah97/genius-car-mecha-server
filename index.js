const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectID;
const { ObjectID } = require('bson');


const app = express()
const port = process.env.port || 5000

//middlewere
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzy7l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services')

        //get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        //get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("getting specific service")
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })

        //post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the api', service)

            // res.send('post hited')
            console.log('got it')
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        })
        // Delete api
        app.delete('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query ={_id:ObjectID(id)}
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })
    }
    finally {
        // await client.close
    }
}

run().catch(console.dir)





app.get('/', (req, res) => {
    res.send('Running Genius Server')
})

app.listen(port, () => {
    console.log('Running Genius Server On Port', port)
})