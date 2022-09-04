import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import Page from '../../../Components/Page';
import Resource from '../../../Resource';
import './index.css';
import {connect} from 'react-redux';
import {updateBase, updateUserDataEntry} from '../../../Redux/Actions/base';
import SpecialityCard from '../../SpecialityCard';
import DoctorCard from '../../DoctorCard';
import ModalInsureBox from '../../Modal/ModalInsureBox';
import App from '../../../App';
import ModalPayment from "../../Modal/ModalPayment";
import service from "../../../service";
import moment from "jalali-moment";
import {api} from "../../../api";
import Notif from "../../../Components/Notif";
import Main from "../../../ElectronLayer/Main";
import Button from "../../../Components/Button";
import ModalNumberKeyboard from "../../Modal/ModalNumberKeyboard";
import ModalKeyboard from "../../Modal/ModalKeyboard";
import ModalGender from "../../Modal/ModalGender";

class PageTellFinalization extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {};

        this.ref = {
            modalNumberKeyboard: React.createRef(),
            modalKeyboard: React.createRef(),
            modalInsureBox: React.createRef(),
            modalPayment: React.createRef(),
            modalGender: React.createRef(),
            paymentPrint: React.createRef()
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.queueInsuranceInquiry()
    }

    render() {
        const {props} = this;
        const userDataEntry = props.base.userDataEntry;
        const price = (userDataEntry.internetResInfo.remainedPaymentAmount);


        return <React.Fragment>
            <Page className={'PageTellFinalization dis-f'} id={'PageTellFinalization'}>

                <SpecialityCard
                    data={{
                        ...userDataEntry.speciality,
                        icon: Resource.IMAGE.DARMANGAH,
                        title: `درمانگاه: ${userDataEntry.internetResInfo.sp_name || ''}`
                    }}/>

                <DoctorCard className={'mar-b-20'} data={{
                    ...userDataEntry.doctor,
                    avatar: Resource.IMAGE.DOCTOR,
                    name: `نام پزشک: ${userDataEntry.internetResInfo?.docName || ''} ${userDataEntry.internetResInfo?.docFamily}`
                }}/>

                <div>
                    {userDataEntry.nationality !== 'FOREIGN' && <CheckList className={'mar-b-20'}
                                                                           title={`نام بیمار: ${userDataEntry.internetResInfo.patientName ? `${userDataEntry.internetResInfo.patientName} ${userDataEntry.internetResInfo.patientFamily}` : ' . . .'}`}
                                                                           checked={Boolean(userDataEntry.internetResInfo.patientName)}/>}
                    <CheckList className={'mar-b-20'}
                               title={`بیمه بیمار: ${userDataEntry.internetResInfo?.insuranceName || userDataEntry.insurance?.name || ' . . .'}`}
                               checked={Boolean(userDataEntry.internetResInfo?.insuranceName || userDataEntry.insurance)}/>
                    <CheckList className={'mar-b-20'}
                               title={`شماره بیمه بیمار: ${userDataEntry?.insuranceNumber || userDataEntry.internetResInfo.insuranceID || ' . . .'}`}
                               checked={Boolean(userDataEntry.insurance || userDataEntry.internetResInfo.insuranceID)}/>
                    <CheckList className={'mar-b-20'} title={`پرداخت فرانشیز بیمار: ${App.formatMoney(price)} ریال`}
                               checked={Boolean(userDataEntry.internetResInfo?.remainedPaymentAmount)}/>
                </div>
            </Page>
            <ModalNumberKeyboard refer={ref => this.ref.modalNumberKeyboard = ref}/>
            <ModalKeyboard refer={ref => this.ref.modalKeyboard = ref}/>
            <ModalPayment refer={ref => this.ref.modalPayment = ref}/>
            <ModalInsureBox refer={ref => this.ref.modalInsureBox = ref}/>
            <ModalGender refer={ref => this.ref.modalGender = ref}/>
            <div className="dis-f fb-20">
                <div className="flex"/>
                <Button className={'mar-t-20'} theme={'red'}
                        onClick={this.backClickHandler.bind(this)}>بازگشت</Button>
            </div>
        </React.Fragment>;
    }


    backClickHandler() {
        const {props} = this;

        props.history.push(Resource.Route.HOME);
    }

    cardClickHandler(data) {
        const {props} = this;

        props.updateUserDataEntry({speciality: data});

        props.history.push(Resource.Route.DOCTORS);
    }

    queueBirthdate() {
        service.getPatientBirthDate({context: this})
            .then(birthdate => {
                this.userInfoCheckerBeforePayment();
            })
            .catch(err => console.log(err));
    }

    queueFatherName() {
        service.getPatientFatherName({context: this})
            .then(fatherName => {
                this.props.updateUserDataEntry({
                    internetResInfo: {
                        ...this.props.base.userDataEntry.internetResInfo,
                        patientFatherName: fatherName
                    }
                })
                this.userInfoCheckerBeforePayment();
            })
            .catch(err => console.log(err));
    }

    queueFirstName() {
        service.getPatientFirstName({context: this})
            .then(firstName => {
                this.props.updateUserDataEntry({
                    internetResInfo: {
                        ...this.props.base.userDataEntry.internetResInfo,
                        patientName: firstName
                    }
                })
                this.userInfoCheckerBeforePayment();
            })
            .catch(err => console.log(err));
    }

    queueGender() {
        service.getPatientGender({context: this})
            .then(gender => {
                this.userInfoCheckerBeforePayment();
            })
            .catch(err => console.log(err));
    }

    queueHID() {
        service.generateHID({context: this})
            .then(hid => {
                service.printReceipt({context: this});
            })
            .catch(err => {
                console.log(err);

                service.printReceipt({context: this});
            });
    }

    queueInsuranceInquiry() {
        service.getPatientInsurance({context: this})
            .then(_ => {
                const {setting, base} = this.props;
                const {userDataEntry} = base;
                if (setting.samadCodeInquiry && userDataEntry.standardInsurance.boxId === '26.4') {
                    this.queueSamadCode();
                } else
                    this.userInfoCheckerBeforePayment();
            })
            .catch(err => console.log(err));
    }

    queueLastName() {
        service.getPatientLastName({context: this})
            .then(lastName => {
                this.props.updateUserDataEntry({
                    internetResInfo: {
                        ...this.props.base.userDataEntry.internetResInfo,
                        patientFamily: lastName
                    }
                })
                this.userInfoCheckerBeforePayment();
            })
            .catch(err => console.log(err));
    }

    queueMobile() {
        service.getPatientMobileNumber({context: this})
            .then(mobile => {
                this.userInfoCheckerBeforePayment()
            })
            .catch(err => console.log(err));
    }

    queuePayment() {
        service.sendPatientForPayment({context: this})
            .then(_ => {
                const {setting} = this.props;
                const {userDataEntry} = this.props.base;

                if (setting.generateHID && userDataEntry.standardInsurance.id) {
                    this.queueHID();
                } else {
                    service.printReceipt({context: this});
                }
            })
            .catch(err => console.log(err));
    }

    queueServicePrice() {
        service.getServicePriceAmount({context: this})
            .then(_ => {
                this.props.updateBase({loading: false});

                this.queuePayment();
            })
            .catch(err => {
                this.props.updateBase({loading: false});

                console.log(err);
                new Notif({message: 'دریافت قیمت خدمت با خطا مواجه شد', theme: 'error'}).show();
                this.props.history.push(Resource.Route.HOME);
            });
    }


    queueSabtAhvalInquiry() {
        const {props} = this;
        const {setting, base} = props;
        const {userDataEntry} = base;
        props.updateBase({loading: true});


        if (userDataEntry.nationalCode && userDataEntry.internetResInfo.patientBDate) {
            if (setting.DITAS && !setting.DIRECT_INQUIRY) {
                Main.person(userDataEntry.nationalCode, moment(userDataEntry.internetResInfo.patientBDate).format('jYYYY'), setting.personPath)
                    .then(data => {
                        props.updateUserDataEntry({
                            internetResInfo: {
                                ...this.props.base.userDataEntry.internetResInfo,
                                patientName: data.FirstName == '-' || !data.FirstName ? userDataEntry.internetResInfo.patientName : data.FirstName,
                                patientFamily: data.LastName == '-' || !data.LastName ? userDataEntry.internetResInfo.patientFamily : data.LastName,
                                patientFatherName: data.Father_FirstName == '-' || !data.Father_FirstName ? userDataEntry.internetResInfo.patientFatherName : data.Father_FirstName,
                                patientSEX: data.Gender ? data.Gender === '1' ? 'MALE' : 'FEMALE' : userDataEntry.internetResInfo.internetResInfo.patientSEX
                            }
                        });
                        props.updateBase({loading: false});

                    })
                    .catch(err => {
                        console.log(err);
                        props.updateBase({loading: false});
                    });
            } else if (setting.DIRECT_INQUIRY || (setting.DIRECT_INQUIRY && setting.DITAS)) {
                api.getSabtAhvalData(userDataEntry.nationalCode, moment(userDataEntry.internetResInfo.patientBDate, 'jYYYY/jMM/jDD').format('jYYYYjMMjDD'))
                    .then(data => {
                        props.updateUserDataEntry({
                            internetResInfo: {
                                ...this.props.base.userDataEntry.internetResInfo,
                                patientName: data.FirstName == '-' || !data.FirstName ? userDataEntry.internetResInfo.patientName : data.FirstName,
                                patientFamily: data.LastName == '-' || !data.LastName ? userDataEntry.internetResInfo.patientFamily : data.LastName,
                                patientFatherName: data.Father_FirstName == '-' || !data.Father_FirstName ? userDataEntry.internetResInfo.patientFatherName : data.Father_FirstName,
                                patientSEX: data.Gender ? data.Gender === '1' ? 'MALE' : 'FEMALE' : userDataEntry.internetResInfo.internetResInfo.patientSEX
                            }
                        });
                        props.updateBase({loading: false});
                        this.userInfoCheckerBeforePayment()
                    })
                    .catch(err => {
                        console.log(err);
                        props.updateBase({loading: false});
                    })
            }
        }
    }

    queueSamadCode() {
        service.getPatientSamadCode({context: this})
            .then(samadCode => {
                if (samadCode) {
                    const {props} = this;
                    const {userDataEntry} = props.base;

                    props.updateBase({loading: true});

                    api.checkSamadCode(userDataEntry.nationalCode, userDataEntry.samadCode || samadCode)
                        .then(_ => {
                            props.updateBase({loading: false});

                            this.userInfoCheckerBeforePayment();
                        })
                        .catch(_ => {
                            props.updateBase({loading: false});

                            this.props.updateUserDataEntry({
                                shafadocInsurance: {
                                    id: 1,
                                    name: "آزاد",
                                    number: null,
                                    insurer: 0
                                },
                                samadCode: null
                            });
                            this.userInfoCheckerBeforePayment();
                        });
                } else {
                    this.props.updateUserDataEntry({
                        shafadocInsurance: {
                            id: 1,
                            name: "آزاد",
                            number: null,
                            insurer: 0
                        },
                        samadCode: null
                    });

                    this.userInfoCheckerBeforePayment();
                }
            })
            .catch(err => console.log(err));
    }

    userInfoCheckerBeforePayment() {
        const {props} = this;
        const {setting} = props;
        const {userDataEntry} = props.base;

        if (userDataEntry.internetResInfo.patientBDate && (!userDataEntry.internetResInfo.patientFatherName || userDataEntry.internetResInfo.patientFatherName === '-'))
            this.queueSabtAhvalInquiry();

        if (!userDataEntry.internetResInfo.patientBDate || userDataEntry.internetResInfo.patientBDate === '-' )
            this.queueBirthdate();
        else if (!userDataEntry.internetResInfo.patientName || userDataEntry.internetResInfo.patientName === '-')
            this.queueFirstName();
        else if (!userDataEntry.internetResInfo.patientFamily || userDataEntry.internetResInfo.patientFamily === '-')
            this.queueLastName();
        else if (!userDataEntry.internetResInfo.patientFatherName || userDataEntry.internetResInfo.patientFatherName === '-')
            this.queueFatherName();
        else if (!userDataEntry.internetResInfo.patientSEX || userDataEntry.internetResInfo.patientSEX === '-')
            this.queueGender();
        else if (setting.patientMobile && !userDataEntry.mobile) {
            this.queueMobile();
        } else
            this.queueServicePrice();
    }
}

class CheckList extends MyComponent {
    render() {
        const {props} = this;

        return <div className={`CheckList ${props.className} ${props.checked ? 'checked' : ''}`}
                    onClick={props.onClick}>{props.title}</div>;
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
        updateBase: props => dispatch(updateBase(props))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageTellFinalization);