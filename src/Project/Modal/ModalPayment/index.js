import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import './index.css';
import Modal, {ModalContent} from '../../../Components/Modal';
import Button from '../../../Components/Button';
import Resource from '../../../Resource';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import App from "../../../App";
import Main from "../../../ElectronLayer/Main";
import signalR from "../../../signalr";
import Notif from "../../../Components/Notif";
import BackToMainMenu from "../../../backToMainMenu";
import {updateUserDataEntry} from "../../../Redux/Actions/base";
import service from "../../../service";

class ModalPayment extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            resolve: _ => null,
            reject: _ => null,
            paying: false
        };

        this.ref = {
            modal: React.createRef(),
            close: React.createRef()
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.refer({current: this});

    }

    render() {
        const {state, props} = this;
        const {setting} = props
        const {userDataEntry} = props.base;
        let zeroPrice;
        const chargeAmount = userDataEntry.reciept ? setting.chargeAmount ? userDataEntry.paymentData?.chargeAmount : 0 : setting.chargeAmountReserve ? userDataEntry.paymentData?.chargeAmount : 0;
        if (userDataEntry.reciept) {
            if (userDataEntry.internetResInfo.paymentAmount === 0 && userDataEntry.internetResInfo.remainedPaymentAmount === 0) {
                zeroPrice = 0;
            } else {
                zeroPrice = userDataEntry.paymentData?.priceAmount
            }
        } else {
            if (setting.reservePrice) {
                zeroPrice = userDataEntry.paymentData?.priceAmount;
            } else {
                zeroPrice = 0
            }
        }

        const price = (chargeAmount || 0) + (zeroPrice || 0);
        const porsantCondition = (userDataEntry.reciept && setting.shafadocPorsantPrompt && setting.chargeAmount && userDataEntry?.paymentData?.chargeAmount > 0) || (!userDataEntry.reciept && setting.shafadocPorsantPrompt && userDataEntry?.paymentData?.chargeAmount > 0);

        return <Modal
            required={true}
            ref={this.ref.modal}
            name={'ModalPayment'}
            size={'medium'}>
            <ModalContent onClick={_ => BackToMainMenu.resetTimer()}>
                {state.paying ?
                    <div className={'pad-8 dis-f'}><img className={'loader'} src={Resource.IMAGE.LOADER.BLACK} alt=""/>
                        <h3 style={{fontSize: '22px'}}>???????? ???????? ???? ??????????...</h3></div> : null}
                <div className={'pad-8 dis-f'}><h3 style={{fontSize: '30px', margin: 'auto'}}>???????? ???????? ????????????: <span
                    style={{color: 'var(--goo-gre)'}}>{App.formatMoney(price)} ????????</span></h3></div>
                {porsantCondition && <p className={'promp'}>{setting.shafadocPorsantPrompt}</p>}
                <div className={'pad-8 dis-f'}>
                    {!state.paying ? <Button className={'flex mar-e-8'} onClick={this.pay.bind(this)}
                                             theme="green">????????????</Button> : null}
                    <Button className={'flex'} onClick={this.backToMainMenu.bind(this, false)}
                            theme="red">???????????? {state?.timer}</Button>
                </div>
            </ModalContent>
        </Modal>;
    }

    backToMainMenu() {
        const {props} = this;

        this.close(false);

        setTimeout(_ => {
            props.history.push(Resource.Route.HOME);
        }, 500);
    }

    close(success) {
        const {state} = this;

        BackToMainMenu.clearTimer();

        this.ref.modal.current.close();

        if (success === true) {
            state.resolve();
        } else {
            state.reject();
        }
    }

    open(data, action) {
        const {props} = this;
        if (props.base.userDataEntry?.internetResInfo?.paymentAmount > 0 && props.setting.generateHID) {
            this.queueHID()
        } else if (this.props.base.userDataEntry?.internetResInfo?.paymentAmount > 0 && !this.props.setting.generateHID) {
            this.props.history.push(Resource.Print.RECEIPT)
        } else {
            return new Promise((resolve, reject) => {
                const {setting} = this.props;

                BackToMainMenu.setTimer(this, setting.backToMainMenuDuration ? 60 : undefined);

                this.setState({
                    resolve,
                    reject,
                    data,
                    action,
                    fields: {},
                    error: null
                });

                return this.ref.modal.current.open();
            });
        }
    }

    pay() {
        const {props} = this;
        const {setting} = props;
        const {userDataEntry} = props.base;
        const chargeAmount = userDataEntry.reciept ? setting.chargeAmount ? userDataEntry.paymentData?.chargeAmount : 0 : setting.chargeAmountReserve ? userDataEntry.paymentData?.chargeAmount : 0;
        let zeroPrice;
        if (userDataEntry.reciept) {
            if (userDataEntry.internetResInfo.paymentAmount === 0 && userDataEntry.internetResInfo.remainedPaymentAmount === 0) {
                zeroPrice = 0;
            } else {
                zeroPrice = userDataEntry.paymentData?.priceAmount
            }
        } else {
            if (setting.reservePrice) {
                zeroPrice = userDataEntry.paymentData?.priceAmount
            } else {
                zeroPrice = 0;
            }
        }
        const price = zeroPrice + chargeAmount;

        if (price === 0 && setting.reciept) {
            if (setting.generateHID && userDataEntry.standardInsurance.id) {
                this.queueHID();
            } else {
                this.history.push(Resource.Print.RECEIPT);
            }
        } else if (price === 0 && !setting.reciept)
            this.close(true)
        else {
            this.setState({paying: true});

            Main.callPos(setting?.multiAccountPayment, setting.posServerIp, price.toString(), `${setting.reservePrice ? userDataEntry.paymentData?.priceAmount : 1},${userDataEntry.paymentData?.chargeAmount}`, userDataEntry.nationalCode || '')
                .then(data => {
                    if (this.unmounted)
                        return;

                    this.setState({paying: false});
                    console.log('pos data', data);

                    if (data?.result?.ResponseCode === '00') {
                        props.updateUserDataEntry({transactionId: data?.result?.RRN});

                        signalR.setPayData({
                            Response_Code: data?.result?.ResponseCode,
                            Response_Description: data?.result?.ResponseDescription,
                            Card_Number_Mask: data?.result?.CardNumberMask,
                            Card_Number_Hash_Sha1: data?.result?.CardNumberHash_Sha1,
                            Trace_Number: data?.result?.TraceNumber,
                            Txn_Date: data?.result?.TxnDate,
                            RRN: data?.result?.RRN,
                            Terminal_Id: data?.result?.TerminalId,
                            Serial_Id: data?.result?.SerialId,
                            Req_Amount: data?.result?.ReqAmount || 0,
                            POS_Version: data?.result?.POS_Version,
                            Code_Meli: userDataEntry?.nationalCode || '',
                            Kiosk_Num: setting.kioskNumber,
                            Pos_Ip: data?.result?.PayId,
                            Service_Id: userDataEntry.doctor?.id
                        });

                        requestAnimationFrame(_ => {
                            this.close(true);
                        });
                    } else {
                        new Notif({message: '???????????? ?????? ???????? ???????????? ???????????? ????????.', theme: 'error'}).show();
                    }
                })
                .catch(message => {
                    if (this.unmounted)
                        return;

                    this.setState({paying: false});

                    new Notif({message, theme: 'error'}).show();
                });
        }
    }

    queueHID() {
        service.generateHID({context: this})
            .then(hid => {
                this.props.history.push(Resource.Print.RECEIPT)
            })
            .catch(err => {
                console.log(err);

                this.props.history.push(Resource.Print.RECEIPT)
            });
    }
}

const mapStateToProps = state => {
    return {
        base: state.base,
        setting: state.setting
    };
};
const mapDispatchToProps = dispatch => {
    return {
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props)),
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalPayment));