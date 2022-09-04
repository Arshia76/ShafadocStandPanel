import React from 'react'
import MyComponent from "../../../Components/MyComponent";
import {futureReserves, paraclinicPayments, todayReserves} from "../../../db";
import './index.css'
import Button from "../../../Components/Button";
import {Url} from "../../../App";
import Resource from "../../../Resource";

class PageQueue extends MyComponent {
    constructor(props) {
        super(props);

        console.log(props);
        this.state = {
            type: props.match.params.type || 'today',
            list: [],
            keys: []
        };
    }

    componentDidMount() {
        this.loadList();
    }

    render() {
        const {state, props} = this;
        return <div>
            <div style={{display: 'flex'}}>
                <Button theme={'blue'} className={'mar-8'} onClick={this.changeQueueClickHandler.bind(this, 'today')}
                        disabled={props.match.params.type === 'today'}>صف روز جاری</Button>
                <Button theme={"blue"} className={'mar-8'} onClick={this.changeQueueClickHandler.bind(this, 'future')}
                        disabled={props.match.params.type === 'future'}>صف روز‌های آینده</Button>
                <Button theme={"blue"} className={'mar-8'}
                        onClick={this.changeQueueClickHandler.bind(this, 'paraclinic')}
                        disabled={props.match.params.type === 'paraclinic'}>صف پرداخت</Button>
                <Button theme={"red"} className={'mar-8'}
                        onClick={_ => props.history.push(Resource.Route.SETTING)}>بازگشت</Button>
                <div className="flex"></div>
                <Button theme={"yellow"} className={'mar-8'} onClick={this.removeFinishedReserves.bind(this)}>{{
                    today: 'حذف رزرو‌های تکمیلی جاری',
                    future: 'حذف رزرو‌های تکمیلی آینده',
                    paraclinic: 'حذف پرداخت های تکمیلی پاراکلینیک'
                }[props.match.params.type]}</Button>
                <Button theme={"red"} className={'mar-8'} onClick={this.removeAllReserves.bind(this)}>{{
                    today: 'حذف کل رزرو‌های جاری',
                    future: 'حذف کل رزرو‌های آینده',
                    paraclinic: 'حذف کل پرداخت های پاراکلینیک '
                }[props.match.params.type]}</Button>
            </div>
            <table>
                <tr>
                    {state.keys.map((item, index) => <th key={index}>{item}</th>)}
                </tr>
                {state.list.map((row, i) => <tr key={i}>
                    {state.keys.map((key, j) => <td
                        key={`${i}${j}`}>{['response'].includes(key) ? JSON.stringify(row[key]) : row[key]}</td>)}
                </tr>)}
            </table>
        </div>
    }

    changeQueueClickHandler(type) {
        this.props.history.push(Url.parse(Resource.Route.QUEUE, {type}));

        this.setState({type}, _ => {
            this.loadList();
        });
    }

    loadList() {
        if (this.state.type === 'today')
            todayReserves.list(true)
                .then(list => {
                    this.setState({
                        list,
                        all: list.length,
                        unfinished: list.reduce((item, sum) => sum + (item.finished === 'false' ? 1 : 0), 0),
                        keys: Object.keys(list?.[0] || {})
                    });
                });


        if (this.state.type === 'future')
            futureReserves.list(true)
                .then(list => {
                    this.setState({
                        list,
                        keys: Object.keys(list?.[0] || {})
                    });
                });

        if (this.state.type === 'paraclinic')
            paraclinicPayments.list(true)
                .then(list => {
                    this.setState({
                        list,
                        keys: Object.keys(list?.[0] || {})
                    });
                });
    }

    removeAllReserves() {
        switch (this.state.type) {
            case'today':
                todayReserves.clearAll()
                    .then(_ => {
                        this.loadList();
                    });
                break;
            case 'future':
                futureReserves.clearAll()
                    .then(_ => {
                        this.loadList();
                    });
                break;
            case 'paraclinic':
                paraclinicPayments.clearAll()
                    .then(_ => {
                        this.loadList();
                    });
                break;
            default:
                break;
        }
    }

    removeFinishedReserves() {
        switch (this.state.type) {
            case'today':
                todayReserves.clearSentRows()
                    .then(_ => {
                        this.loadList();
                    });
                break;
            case 'future':
                futureReserves.clearSentRows()
                    .then(_ => {
                        this.loadList();
                    });
                break;
            case 'paraclinic':
                paraclinicPayments.clearSentRows()
                    .then(_ => {
                        this.loadList();
                    });
                break;
            default:
                break;
        }
    }
}

export default PageQueue;