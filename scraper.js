const axios = require("axios");
const cheerio = require("cheerio");


const getDailyStocksChange = async (stocks) => {
    console.log("getDailyStocksChange -> getDailyStocksChange stating...")
    try {

        const dailyResults = await Promise.all(stocks.map(async (stock) => {
            const stockUrl = `https://www.bizportal.co.il/mutualfunds/quote/generalview/${stock.stockId}/`
            return await axios.get(stockUrl).then((res) => {
                const $ = cheerio.load(res.data);
                const name = $('.paper-name').text();
                const currentPrice = $('body > div.container.body-content.redesignedquote > section > article.top-area > div.data-row.mutual-funds > div:nth-child(1) > div.num').text();
                const dailyChange = $('body > div.container.body-content.redesignedquote > section > article.top-area > div.data-row.mutual-funds > span:nth-child(3) > span:nth-child(1)').text();
                const managementFee = $('body > div.container.body-content.redesignedquote > section > article.main-part > div > div.col-lg-6.no-padding.paper-data > div:nth-child(1) > div:nth-child(2) > ul > li:nth-child(1) > span.num').text();
                const loyaltyFee = $('body > div.container.body-content.redesignedquote > section > article.main-part > div > div.col-lg-6.no-padding.paper-data > div:nth-child(1) > div:nth-child(2) > ul > li:nth-child(2) > span.num').text();
                const newValue = +(+stock.amount * +currentPrice.replace(/%/g, '') / 100).toFixed(2)
                const lastValue = newValue / (1 + +dailyChange.replace(/%/g, '') / 100)
                const dailyMoneyChange = newValue - lastValue
                const stockResult = {
                    name, currentPrice, dailyChange, managementFee, loyaltyFee, newValue, dailyMoneyChange, stockId: stock.stockId
                }
                return stockResult
            })
        }))

        return dailyResults
    } catch (error) {
        console.log("fetchData -> error", error)
        return { status: 999 }
    }
};

module.exports = getDailyStocksChange;