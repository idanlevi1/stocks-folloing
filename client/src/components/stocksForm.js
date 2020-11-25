import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import { RemoveCircleOutline, AddCircleOutline } from '@material-ui/icons';

export default class stocksForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            age: null,
            myStocks: [{}]
        };
    }

    componentDidMount() {
        const myStocks = JSON.parse(localStorage.getItem('myStocks') || '[{}]')
        this.setState({ myStocks })
    }

    myChangeHandler = (event, index) => {
        let nam = event.target.name;
        let val = event.target.value;
        let myStocks = this.state.myStocks.slice()
        myStocks[index][nam] = val
        this.setState({ myStocks });
    }

    onAddStock = (event) => {
        this.setState({ myStocks: [...this.state.myStocks, {}] })
    }

    onRemoveStock = (e, index) => {
        if (this.state.myStocks.length > 1) {
            let newMyStocks = this.state.myStocks.slice()
            newMyStocks.splice(index, 1)
            this.setState({ myStocks: newMyStocks })
        } else {
            this.setState({ myStocks: [{}] })
        }
    }

    isFull = (index) => {
        const { name = '', amount = '', stockId = '' } = this.state.myStocks[index]
        return name.toString().trim().length > 0 && amount.toString().trim().length > 0 && stockId.toString().trim().length > 0
    }

    onSubmitForm = () => {
        let fullStocks = []
        this.state.myStocks.forEach((stock, i) => {
            if (this.isFull((i))) {
                fullStocks.push(stock)
            }
        })
        this.setState({ myStocks: fullStocks.length > 0 ? fullStocks : [{}] }, () => localStorage.setItem('myStocks', JSON.stringify(this.state.myStocks)))
    }

    render() {
        const { myStocks } = this.state
        return (
            <div style={{ direction: 'rtl' }}>
                {myStocks.map((stock, index) => (
                    <form style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }} key={index}>
                        {index + 1}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ paddingLeft: 5 }}>שם הנייר</p>
                            <input
                                type='text'
                                name='name'
                                value={stock.name || ''}
                                onChange={(e) => this.myChangeHandler(e, index)}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ paddingLeft: 5 }}>כמות</p>
                            <input
                                type='text'
                                name='amount'
                                value={stock.amount || ''}
                                onChange={(e) => this.myChangeHandler(e, index)}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ paddingLeft: 5 }}>מספר הנייר</p>
                            <input
                                type='text'
                                name='stockId'
                                value={stock.stockId || ''}
                                onChange={(e) => this.myChangeHandler(e, index)}
                            />
                        </div>
                        {(myStocks.length == (index + 1)) && <AddCircleOutline style={{ fontSize: 30, color: this.isFull(index) ? 'green' : '#ccc' }} onClick={this.isFull(index) ? this.onAddStock : () => { }} />}
                        <RemoveCircleOutline style={{ fontSize: 30, color: 'red' }} onClick={(e) => this.onRemoveStock(e, index)} />
                    </form>
                ))}
                <Button variant="contained" color="primary" onClick={this.onSubmitForm} >Save</Button>
            </div>
        );
    }
}