const express = require('express');

// Create an Express application
const app = express();

// Define a route handler for the root URL
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server and listen on port 3000
const port = 3002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
