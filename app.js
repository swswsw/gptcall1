import express from 'express';
import { getCompletion } from './gptcall.js';

const app = express();
const port = 4545;

// Add middleware to parse JSON bodies
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// New route to handle GPT API call
app.post('/gptcall', async (req, res) => {
  const inputString = req.body.input;
  
  if (!inputString) {
    return res.status(400).json({ error: 'No input string provided' });
  }

  try {
    const outputString = await getCompletion(inputString);
    res.json({ output: outputString });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
