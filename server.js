const express = require('express');
const getDailyStocksChange = require("./scraper");
var bodyParser = require('body-parser')
const path = require('path');

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(bodyParser.json());

app.post("/api/getMyStocks", async function (req, res, next) {
  const result = await getDailyStocksChange(req.body);
  return res.send(result)
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port}`);