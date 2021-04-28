import React, { Component } from 'react';
import './stocks.css';
import { getColor } from '../Tools';

class Stocks extends Component {
  constructor() {
    super();
    this.state = {
      stocks: null,
      totalDailyChangeText: '',
      historyDailyChanges: [],
      emptyStocks: false,
    };
  }

  componentDidMount() {
    const myStocks = localStorage.getItem('myStocks') || '[{}]'

    fetch('/api/getMyStocks',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: myStocks
      })
      .then(res => res.json())
      .then(stocks => {
        if (stocks.length == 0 || !stocks[0].stockId) {
          this.setState({ emptyStocks: true })
          return
        }
        const totalDailyChange = stocks.reduce((a, b) => ({ dailyMoneyChange: a.dailyMoneyChange + b.dailyMoneyChange })).dailyMoneyChange
        const totalDailyChangeText = `----------- Total Daily Change: ${totalDailyChange.toFixed(2)}₪ ${totalDailyChange > 0 ? '✅' : '❌'} -----------`
        let newHistoryDailyChanges = JSON.parse(localStorage.getItem('historyDailyChanges')) || []
        if (newHistoryDailyChanges.length == 0 || newHistoryDailyChanges[newHistoryDailyChanges.length - 1].dailyChange != totalDailyChange.toFixed(2)) {
          const totalValueOfAllStocks = stocks.map(s => s.newValue).reduce((a, b) => a + b, 0).toFixed(2)
          newHistoryDailyChanges.push({ date: new Date().toJSON().slice(0, 11), dailyChange: totalDailyChange.toFixed(2), totalValue: totalValueOfAllStocks })
          localStorage.setItem(`historyDailyChanges`, JSON.stringify(newHistoryDailyChanges))
        }
        this.setState({ stocks, totalDailyChangeText, historyDailyChanges: newHistoryDailyChanges }, () => console.log('Customers fetched...', stocks))
      }).catch(e => console.log(e));
  }

  uniqBy = (arr, predicate) => {
    const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];

    return [...arr.reduce((map, item) => {
      const key = (item === null || item === undefined) ?
        item : cb(item);

      map.has(key) || map.set(key, item);

      return map;
    }, new Map()).values()];
  };

  render() {
    if (this.state.emptyStocks) {
      return (
        <div style={{ marginTop: 50 }}>
          <p>התיק שלך ריק, אנא ערוך אותו</p>
        </div>)
    }
    return (
      <div>
        {this.state.stocks ?
          <div style={{ marginBottom: 30 }}>
            <table style={{ marginTop: 50 }} id="t01">
              <tr>
                <th className='th_results'>דמי נאמנות</th>
                <th className='th_results'>דמי ניהול</th>
                <th className='th_results'>ערך נוכחי</th>
                <th className='th_results'>מחיר נוכחי</th>
                <th className='th_results'>שינוי יומי בשקלים</th>
                <th className='th_results'>שינוי יומי באחוזים</th>
                <th className='th_results'>שם נייר</th>
                <th className='th_results'>מספר מנייר</th>
              </tr>
              {this.state.stocks.map((stock, i) => {
                const { name, currentPrice, dailyChange, managementFee, loyaltyFee, newValue, dailyMoneyChange, stockId } = stock
                return (
                  <tr key={i}>
                    <td>{loyaltyFee}</td>
                    <td>{managementFee}</td>
                    <td>{newValue}</td>
                    <td>{currentPrice}</td>
                    <td style={{ color: +dailyMoneyChange > 0 ? 'green' : 'red', direction: 'ltr' }}>{dailyMoneyChange.toFixed(2)}</td>
                    <td style={{ color: getColor(+dailyChange.replace(/%/g, '')), direction: 'ltr' }}>{dailyChange}</td>
                    <td>{name}</td>
                    <td>{stockId}</td>
                  </tr>
                )
              })}
            </table>
            <h4>{this.state.totalDailyChangeText}</h4>
            <p>---History----</p>
            {this.uniqBy(this.state.historyDailyChanges, 'date').reverse().map((change, i) => <p>{`${change.date} | Daily change: ${change.dailyChange} | Total value: ${change.totalValue || '-'}`}</p>)}
          </div>
          :
          <p>Loading...</p>}
      </div>
    );
  }
}

export default Stocks;
