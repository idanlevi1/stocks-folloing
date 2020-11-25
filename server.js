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
app.use(express.static(__dirname + './client/public'));


const port = 5000;

app.listen(port, () => `Server running on port ${port}`);