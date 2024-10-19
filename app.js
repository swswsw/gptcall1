const express = require('express');
const app = express();
const port = 3000;

// Add middleware to parse JSON bodies
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// New route to handle large string input and output
app.post('/gptcall', (req, res) => {
  const inputString = req.body.input;
  
  if (!inputString) {
    return res.status(400).json({ error: 'No input string provided' });
  }

  // Process the input string (in this example, we're just reversing it)
  const outputString = inputString.split('').reverse().join('');

  res.json({ output: outputString });
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
