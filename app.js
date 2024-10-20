import express from 'express';
import { getCompletion } from './gptcall.js';
import { outputEncryptedPdf } from './encryptionUtil.js';

const app = express();
const port = 4545;

let savedContractString = "";

// Add middleware to parse JSON bodies
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// New route to handle GPT API call
app.post('/gptcall', async (req, res) => {
  const inputString = req.body.input;
  console.log("gptcall received input: ", inputString);

  if (!inputString) {
    return res.status(400).json({ error: 'No input string provided' });
  }

  try {
    const outputString = await getCompletion(inputString);
    console.log("gptcall returned output: ", outputString);
    savedContractString = outputString;
    res.send(outputString);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

// New route to handle PDF encryption
app.get('/encryptpdf', async (req, res) => {
  try {
    let encryptedFilePath = await outputEncryptedPdf(savedContractString);
    res.send(encryptedFilePath);
  } catch (error) {
    console.error('Error encrypting PDF:', error);
    res.status(500).json({ error: 'Error encrypting PDF' });
  }
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
