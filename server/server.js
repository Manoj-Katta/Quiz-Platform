// server.js (or index.js for your backend)

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path';
import connectDB from './config/connection.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { authMiddleware } from './utils/auth.js';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

dotenv.config();

const PORT = process.env.PORT || 3001;
const mongoUrl = 'mongodb+srv://2021ucs0106:9x6hM0egCSi4t5Qf@cluster0.hm3fpk3.mongodb.net/Roadmaps?retryWrites=true&w=majority';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();

// Enable CORS
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/getRows/:number/:skill', async (req, res) => {
  const { number, skill } = req.params;

  try {
    console.log('Received request for number:', number, 'and skill:', skill);

    const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db('Articles');
    const collection = database.collection('Javascript');

    // Convert number to float
    const numericValue = parseFloat(number);

    // Define a range for finding rows near the specified number
    const range = 0.5; // Adjust this value based on your requirements

    // Adjust the field names in the query based on your data structure
    const result = await collection.find({
      "Average Rating": { $gte: numericValue - range, $lte: numericValue + range },
      domain: skill
    }).limit(3).toArray();

    console.log('Matching rows:', result);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } 
});


// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(new URL('../client/dist', import.meta.url).pathname)));
}

// Send index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(new URL('../client/dist/index.html', import.meta.url).pathname));
});

const startServer = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app });
    connectDB(process.env.MONGODB_URI);

    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const db = client.db('Roadmaps');
    const collection = db.collection('Javascript');

    app.get('/get-data', async (req, res) => {
      try {
        const data = await collection.find({}).toArray();
        res.json(data);
      } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    process.on('SIGINT', () => {
      client.close();
      process.exit();
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
