const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray()
            res.send(services)
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