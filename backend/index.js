const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const transactionsFile = path.join(__dirname, 'data', 'transactions.json');

// Read transactions
app.get('/transactions', (req, res) => {
  fs.readFile(transactionsFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading transactions' });
    }
    res.json(JSON.parse(data));
  });
});

// Add a transaction
app.post('/transactions', (req, res) => {
  const newTransaction = req.body;

  fs.readFile(transactionsFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading transactions' });
    }
    
    const transactions = JSON.parse(data);
    transactions.push(newTransaction);

    fs.writeFile(transactionsFile, JSON.stringify(transactions, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error writing transaction' });
      }
      res.status(201).json(newTransaction);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
