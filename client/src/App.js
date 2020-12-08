import React, { useState, useEffect } from 'react';
import './App.css';
import Stocks from './components/stocks';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import StocksForm from './components/stocksForm';
import { Button } from '@material-ui/core';
// const logo = require('../src/assets/images/edit_stocks.jpg');

const modeType = {
  ON_BOARDING: 0,
  EDIT_STOCKS: 1,
  STOCKS_DAILY_CHANGE: 2,
};

const images = [
  {
    url: '/images/edit_stocks.jpg',
    title: 'ערוך תיק ניירות ערך',
    width: '50%',
    mode: modeType.EDIT_STOCKS
  },
  {
    url: '/images/stocks_screen.jpg',
    title: 'מה התיק עשה היום?',
    width: '50%',
    mode: modeType.STOCKS_DAILY_CHANGE
  }
];

function App() {
  const classes = useStyles();
  const [mode, setMode] = useState(modeType.ON_BOARDING);
  const [myStocks, setMyStocks] = useState([]);

  const getHeaderTitle = () => {
    switch (mode) {
      case modeType.ON_BOARDING:
        return 'שינוי יומי במניות וקרנות נאמנות'
      case modeType.EDIT_STOCKS:
        return 'עדכון פרטי ניירות ערך'
      case modeType.STOCKS_DAILY_CHANGE:
        return 'שינוי יומי'
      default:
        break;
    }
  }

  const isFullStock = (stock) => {
    const { name, amount, stockId } = stock
    return name && amount && stockId
  }

  const MyStocksList = () => {
    let fullStocks = []
    myStocks.forEach((stock, i) => {
      if (isFullStock((stock))) {
        fullStocks.push(stock)
      }
    })
    if (fullStocks.length) {
      return (
        <table style={{ marginTop: 30 }} id="t01">
          <tr>
            <th>מספר מנייר</th>
            <th>כמות</th>
            <th>שם נייר</th>
            <th></th>
          </tr>
          {fullStocks.map((stock, i) => {
            const { name, amount, stockId } = stock
            return (
              <tr key={i}>
                <td>{stockId}</td>
                <td>{amount}</td>
                <td>{name}</td>
                <td>{i + 1}</td>
              </tr>
            )
          })}
        </table>
      )
    } else {
      return (
        <div style={{ marginTop: 50 }}>
          <p>התיק שלך ריק, אנא ערוך אותו</p>
          <Button variant="contained" onClick={() => setMode(modeType.EDIT_STOCKS)}>התיק שלי</Button>
        </div>)
    }
  }

  const getContent = () => {
    switch (mode) {
      case modeType.ON_BOARDING:
        return <MyStocksList />
      case modeType.EDIT_STOCKS:
        return <StocksForm />
      case modeType.STOCKS_DAILY_CHANGE:
        return <Stocks />
      default:
        break;
    }
  }

  useEffect(() => {
    const myStocks = JSON.parse(localStorage.getItem('myStocks') || '[{}]')
    setMyStocks(myStocks)
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">{getHeaderTitle()}</h1>
      </header>
      <div className={classes.root}>
        {images.map((image) => (
          <ButtonBase
            onClick={() => setMode(image.mode)}
            focusRipple
            key={image.title}
            className={classes.image}
            focusVisibleClassName={classes.focusVisible}
            style={{
              width: image.width,
              direction: "rtl"
            }}
          >
            <span
              className={classes.imageSrc}
              style={{
                backgroundImage: `url(${image.url})`,
              }}
            />
            <span className={classes.imageBackdrop} />
            <span className={classes.imageButton}>
              <Typography
                component="span"
                variant="subtitle1"
                color="inherit"
                className={classes.imageTitle}
              >
                {image.title}
                <span className={classes.imageMarked} />
              </Typography>
            </span>
          </ButtonBase>
        ))}
      </div>
      {getContent()}
      <div style={{ marginTop: 100 }} />
      <div className="footer">
        <p>Powered by <a className='footer-a' href='https://github.com/idanlevi1'>Idan Levi <img className='footer-icon' src="https://img.icons8.com/cute-clipart/64/000000/github.png" /></a> </p>
      </div>
    </div>
  );
}

export default App;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%',
    marginBottom: 50,
  },
  image: {
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: 100,
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15,
      },
      '& $imageMarked': {
        opacity: 0,
      },
      '& $imageTitle': {
        border: '4px solid currentColor',
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
}));