import express from 'express';
import { ApolloServer } from 'apollo-server-express'; // import ApolloServer for GraphQL
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import path from 'path'; 
import connectDB from './config/connection.js'; // import connection to MongoDB
import { typeDefs, resolvers } from './schemas/index.js'; // import typeDefs and resolvers
import { authMiddleware } from './utils/auth.js'; // import authMiddleware for authentication
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 3001;
const mongoUrl = 'mongodb+srv://2021ucs0106:9x6hM0egCSi4t5Qf@cluster0.hm3fpk3.mongodb.net/Roadmaps?retryWrites=true&w=majority';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, // This ensures that every request performs an authentication check, and the updated request object will be passed to the resolvers as the context.
});

const app = express(); // Create a new instance of an Express server
const modelsPath = join(__dirname, '..', 'models');
app.use('/models', express.static(modelsPath));

app.use(express.urlencoded({ extended: true })); // This sets up middleware to parse incoming requests with urlencoded payloads
app.use(express.json()); // This sets up middleware to parse incoming requests with JSON payloads

if (process.env.NODE_ENV === 'production') {
app.use(express.static(path.join(new URL('../client/dist', import.meta.url).pathname)));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(new URL('../client/dist/index.html', import.meta.url).pathname));
});


const startServer = async (typeDefs, resolvers) => {
  try {
    await server.start(); // Start the Apollo server
    server.applyMiddleware({ app }); // integrate our Apollo server with the Express application as middleware
    connectDB(process.env.MONGODB_URI); // connect to MongoDB
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const db = client.db('Roadmaps');
    const collection = db.collection('Javascript')
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

startServer(typeDefs, resolvers); // Start server