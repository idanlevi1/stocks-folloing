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
  app.use(express.static(__dirname + 'client/build'));
  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => `Server running on port ${port}`);