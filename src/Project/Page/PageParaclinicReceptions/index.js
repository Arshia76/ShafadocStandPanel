import React from 'react';
import Page from '../../../Components/Page';
import MyComponent from '../../../Components/MyComponent';
import './index.css';
import {connect} from 'react-redux';
import ReceptionItem from "../../ReceptionItem";
import {updateUserDataEntry} from "../../../Redux/Actions/base";
import Button from "../../../Components/Button";
import Resource from "../../../Resource";
import BackToMainMenu from "../../../backToMainMenu";
import App from "../../../App";
import ModalPayment from "../../Modal/ModalPayment";
import service from "../../../service";

class PageParaclinicReception extends MyComponent {

    constructor(props) {
        super(props);

        this.state = {};

        this.ref = {
            modalPayment: React.createRef(),
        }
    }


    componentWillUnmount() {
        BackToMainMenu.clearTimer();
    }


    render() {
        const {props} = this
        const {paraclinicData} = props.base.userDataEntry
        const totalPrice = App.formatMoney(paraclinicData?.pendingReceptions.reduce((total, current) => total + current.invoice.payable, 0))
        return (
            <React.Fragment>
                <Page className={'PageParaclinicReceptions'} id={'PageParaclinicReceptions'}>
                    <div className={'patient-name'} style={{marginBottom: '20px'}}>
                        <h4>نام
                            و نام خانوادگی بیمار
                            :{paraclinicData.pendingReceptions[0].patient_first_name + ' ' + paraclinicData.pendingReceptions[0].patient_last_name}</h4>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <div style={{
                                width: '100%',
                                marginBottom: '0',
                                marginTop: '10px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <span style={{margin: '0'}}>مبلغ کل پذیرش ها:</span>
                                <span style={{margin: '0'}}>{totalPrice}ریال</span>
                                <div className={'flex'}/>
                                <Button style={{marginLeft: '10px'}} theme={'green'}
                                        onClick={this.pay.bind(this)}>پرداخت</Button>
                                <Button theme={'red'}
                                        onClick={this.backClickHandler.bind(this)}>بازگشت</Button>
                            </div>

                        </div>
                    </div>
                    {paraclinicData.pendingReceptions.map((item, index) => {
                        return <ReceptionItem {...item} key={index}/>
                    })}
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <span style={{margin: '0'}}>مبلغ کل پذیرش ها: </span>
                        <span style={{margin: '0'}}>{totalPrice}ریال</span>
                        <div className={'flex'}/>
                        <Button style={{marginLeft: '10px'}} theme={'green'}
                                onClick={this.pay.bind(this)}>پرداخت</Button>
                        <Button theme={'red'}
                                onClick={this.backClickHandler.bind(this)}>بازگشت</Button>
                    </div>
                    {/*<div className="dis-f fb-20">*/}
                    {/*    <div className="flex"/>*/}
                    {/*    */}
                    {/*</div>*/}
                </Page>
                <ModalPayment refer={ref => this.ref.modalPayment = ref}/>
            </React.Fragment>
        )
    }

    backClickHandler() {
        const {props} = this;

        props.history.push(Resource.Route.HOME);
    }

    pay() {
        service.sendPatientForPayment({context: this})
            .then(data => console.log(data))
            .catch(e => console.log(e))
    }

}


const mapStateToProps = state => {
    return {
        base: state.base,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageParaclinicReception);