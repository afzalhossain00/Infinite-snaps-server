const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();

// middlewares

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eqk1vsl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const serviceCollection = client.db('infiniteSnaps').collection('services');
        const userReviewCollection = client.db('infiniteSnaps').collection('userReview');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })
        app.get('/all-services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray()
            res.send(services)
        })

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service)
        });


        // user review api
        app.get('/userReview', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = userReviewCollection.find(query);
            const userReview = await cursor.toArray()
            res.send(userReview);
        })

        app.post('/userReview', async (req, res) => {
            const review = req.body;
            const resullt = await userReviewCollection.insertOne(review)
            res.send(resullt)
        })

        app.delete('/userReview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const resullt = await userReviewCollection.deleteOne(query);
            res.send(resullt);
        })

        app.patch('/userReview/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const resullt = await userReviewCollection.updateOne(query, updatedDoc);
            res.send(resullt);
        })
    }

    finally {

    }

}

run().catch(error => console.log(error));


app.get('/', (req, res) => {
    res.send('Infinite Snaps server is running')
})

app.listen(port, () => {
    console.log(`Infinite Snaps server running on ${port}`);
})