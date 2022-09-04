import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import Page from '../../../Components/Page';
import Resource from '../../../Resource';
import './index.css';
import MenuCard from '../../MenuCard';
import ModalNumberKeyboard from '../../Modal/ModalNumberKeyboard';
import Notif from '../../../Components/Notif';
import App from "../../../App";
import {connect} from "react-redux";
import {addNationalCode, resetUserDataEntry, updateBase, updateUserDataEntry} from "../../../Redux/Actions/base";
import {modals} from "../../../Components/Modal";
import moment from "jalali-moment";
import service from "../../../service";
import ModalNationality from "../../Modal/ModalNationality";
import {api} from "../../../api";

class PageMain extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            goToSettingTapCount: 0,
            loading: false
        };

        this.ref = {
            modalNumberKeyboard: React.createRef(),
            modalNationality: React.createRef(),
        };
    }

    componentDidMount() {
        super.componentDidMount();
        window.moment = moment;

        // this.props.history.push(Resource.Print.RECEIPT);
        this.props.updateBase({loading: false});

        const {props} = this;
        const {setting} = props;

        for (let i = 1; i <= 5; i++)
            modals.pop();

        if (!setting.serverDomain) {
            props.history.push(Resource.Route.SETTING);
        }

    }

    render() {
        const {setting,base} = this.props;
        return <React.Fragment>
            <Page className={'PageMain dis-f'} id={'PageMain'}>
                {this.state.loading ? <div className={'background'}>
                    <div className="prompt">
                        <img src={Resource.IMAGE.LOADER.BLACK} alt={''}/>
                        <p>لطفا منتظر بمانید ...</p>
                    </div>
                </div> : null}
                <div className={'fb-6 fb-6x-20 dis-f'} style={{flexDirection: 'column'}}>
                    <img className={'fb-20'} id={'main-logo'} src={Resource.IMAGE.MAIN_LOGO} alt=""
                         onClick={this.goToSetting.bind(this)}/>
                </div>
                <div className={'fb-14 fb-6x-20'}>
                    <MenuCard title={'درمانگاه'} icon={Resource.IMAGE.CIRCLE["1"]}
                              description={'جهت دریافت نوبت حضوری لمس کنید.'}
                              disabled={setting.disableJari && setting.disableFuture}
                              onClick={this.onClickHandler.bind(this, 'darmangah')}/>
                    <MenuCard title={'خدمات پزشکی (سیتی اسکن، رادیولوژی و ...)'} icon={Resource.IMAGE.CIRCLE["2"]}
                              description={'جهت دریافت خدمت لمس کنید.'} disabled={setting.disableServices}
                              onClick={this.onClickHandler.bind(this, 'khadamat')}/>
                    <MenuCard title={'دریافت قبض برای نوبت‌های اینترنتی / تلفنی'} icon={Resource.IMAGE.CIRCLE["3"]}
                              description={'جهت دریافت نوبت اینترنتی لمس کنید.'} disabled={setting.disableReciept}
                              onClick={this.onClickHandler.bind(this, 'gabz')}/>
                    <MenuCard title={setting.paraclinicPaymentText} icon={Resource.IMAGE.CIRCLE["4"]}
                              description={'جهت پرداخت لمس کنید.'}
                              disabled={setting.disableParaclinicPayment || base.unpaied}
                              onClick={this.onClickHandler.bind(this, 'paraclinic')}/>
                    {/*<MenuCard title={'نوبت روزهای آینده '} icon={Resource.IMAGE.CIRCLE["1"]} description={'جهت دریافت نوبت روز جاری لمس کنید.'} onClick={this.onClickHandler.bind(this, 'jari')}/>*/}
                </div>
            </Page>
            <ModalNumberKeyboard refer={ref => this.ref.modalNumberKeyboard = ref}/>
            <ModalNationality refer={ref => this.ref.modalNationality = ref}/>
        </React.Fragment>;
    }

    goToSetting() {
        const {props, state} = this;
        const {goToSettingTapCount} = state;

        if (goToSettingTapCount > 5) {
            this.setState({goToSettingTapCount: 0});

            props.history.push(Resource.Route.SETTING);
        }

        this.setState({goToSettingTapCount: goToSettingTapCount + 1}, _ => {
            App.setUniqueTimeout(_ => {
                this.setState({goToSettingTapCount: 0});
            }, 1000);
        });
    }

    onClickHandler(id) {
        const {props} = this;

        switch (id) {
            case 'darmangah':
                props.resetUserDataEntry();
                props.updateBase({kind: id});
                props.history.push(Resource.Route.DARMANGAH);
                break;
            case 'khadamat':
                new Notif({message: 'فعلا این گزینه فعال نیست.', theme: 'error'}).show();
                break;
            case 'gabz':
                props.resetUserDataEntry();
                props.updateUserDataEntry({reciept: true})
                this.queueNationality()
                break;
            case 'paraclinic':
                props.resetUserDataEntry();
                props.updateUserDataEntry({paraclinicPayment: true})
                props.updateUserDataEntry({
                    nationality: 'IRANIAN'
                })
                this.queueNationalCode()
                break;
            default:
        }
    }

    queueNationality() {
        service.getPatientNationality({context: this})
            .then(nationality => {
                if (nationality === 'IRANIAN') {
                    this.queueNationalCode()
                } else if (nationality === 'FOREIGN') {
                    if (this.props.setting.foreignClientPrevent)
                        new Notif({message: this.props.setting.foreignClientPrevent, theme: 'error'}).show()
                    else
                        this.queueForeignCode()
                }
            })
            .catch(err => console.log(err))
    }

    queueNationalCode() {
        service.getPatientNationalCode({context: this})
            .then(nationalCode => {
                const {userDataEntry} = this.props.base;
                if (userDataEntry.reciept) {
                    this.queueInternetResInfo(nationalCode)
                } else if (userDataEntry.paraclinicPayment) {
                    this.setState({loading: true})
                    const formData = new FormData();
                    formData.append('api_key', process.env.REACT_APP_API_KEY);
                    formData.append('secret', process.env.REACT_APP_SECRET)
                    api.paraclinicLogin(formData)
                        .then(token => {
                            api.getPendingReserves(nationalCode, token.access_token,
                                moment().format("YYYY/MM/DD HH:mm:ss"),
                                moment().subtract(12, "hours").format("YYYY/MM/DD HH:mm:ss"))
                                .then(data => {
                                    this.setState({loading: false})
                                    this.props.updateUserDataEntry({
                                        paraclinicData: {
                                            pendingReceptions: data.data,
                                            token: token.access_token
                                        }
                                    })
                                    if (data.data.length > 0) {
                                        this.props.history.push(Resource.Route.PARACLINIC_RECEPTION)
                                    } else {
                                        new Notif({
                                            message: 'نسخه ای برای این کد ملی ثبت نشده است',
                                            theme: 'error'
                                        }).show()
                                    }
                                })
                                .catch(e => {
                                    console.log(e)
                                    this.setState({
                                        loading: false
                                    })
                                })

                        })
                        .catch(e => {
                            console.log(e);
                            new Notif({
                                message: 'مشکلی در روند ورود رخ داد',
                                theme: 'error'
                            }).show()
                            this.setState({
                                loading: false
                            })
                        })

                }
            })
            .catch(err => console.log(err))
    }

    queueForeignCode() {
        service.getForeignPatientCode({context: this})
            .then(foreignCode => {
                this.setState({loading: true});
                this.queueInternetResInfo(foreignCode)
            })
            .catch(err => console.log(err))
    }

    queueInternetResInfo(code) {
        service.getInternetResInfo({context: this, code})
            .then(data => {
                const {props} = this
                if (this.unmounted)
                    return;

                this.setState({loading: false});

                switch (data.type) {
                    case 'FULL_PAYED_APPOINTMENT': // پرداخت کامل صورت گرفته
                    case 'TELL_APPOINTMENT': // تلفنی
                    case 'FREE_APPOINTMENT': // نوبت رایگان
                        api.getDocInfoByCode(parseInt(props.base.userDataEntry.internetResInfo.docID))
                            .then(data => {
                                props.updateUserDataEntry({
                                    doctor: {
                                        id: data.DocId
                                    }
                                })
                                props.history.push(Resource.Route.TELL_FINALIZATION)
                            })
                            .catch(err => new Notif({message: 'خطایی رخ داده است لطفا بعدا امتحان کنید'}).show())


                        break;

                    case 'UNKNOWN_TYPE': // خطا همچین امکانی پیشبینی نشده است.
                    default:
                        new Notif({message: ' جهت بررسی لطفا به پذیرش مراجعه فرمایید.خطا غیر قابل پیشبینی رخ داد.'}).show();
                }
            })
            .catch(message => {
                if (this.unmounted)
                    return;

                this.setState({loading: false});

                new Notif({message, theme: 'error'}).show();
            });
    }
}

const mapStateToProps = state => {
    return {
        setting: state.setting,
        base: state.base,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props)),
        resetUserDataEntry: _ => dispatch(resetUserDataEntry()),
        addNationalCode: props => dispatch(addNationalCode(props)),
        updateBase: props => dispatch(updateBase(props))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageMain);