const express = require('express');
const getDailyStocksChange = require("./scraper");
var bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());

app.post("/api/getMyStocks", async function (req, res, next) {
  const result = await getDailyStocksChange(req.body);
  return res.send(result)
});

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port}`);