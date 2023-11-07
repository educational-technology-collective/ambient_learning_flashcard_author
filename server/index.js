const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

console.log(uri)

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/cards', async (req, res) => {
    const client = await mongodb.MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = client.db('SIADS_Questions');
    const cards = await db.collection('newFCS').find({}).toArray();
    console.log(cards)
    client.close();

    res.json(cards);
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

