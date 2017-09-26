const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "/index.html"));
});

http.listen(8000, () => {
  console.log('Listening on port 8000 ');
});
