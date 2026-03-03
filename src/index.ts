import express from 'express';
import { createTicket } from './connect.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
  res.json('Ok!');
});

app.post('/ticket', async(req, res) => {
  try {
    await createTicket(req.body);
    res.json('Ok!');
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
  
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

