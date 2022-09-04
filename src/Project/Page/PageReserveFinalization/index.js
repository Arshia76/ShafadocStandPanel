import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import Page from '../../../Components/Page';
import Resource from '../../../Resource';
import './index.css';
import {connect} from 'react-redux';
import {addNationalCode, updateBase, updateUserDataEntry} from '../../../Redux/Actions/base';
import MenuCard from '../../MenuCard';
import SpecialityCard from '../../SpecialityCard';
import DoctorCard from '../../DoctorCard';
import ModalNationality from '../../Modal/ModalNationality';
import ModalInsureBox from '../../Modal/ModalInsureBox';
import App from '../../../App';
import signalR from "../../../signalr";
import Main from "../../../ElectronLayer/Main";
import ModalPayment from "../../Modal/ModalPayment";
import Button from "../../../Components/Button";
import Notif from "../../../Components/Notif";
import {api} from "../../../api";
import ModalNumberKeyboard from "../../Modal/ModalNumberKeyboard";
import moment from "jalali-moment";
import ModalKeyboard from "../../Modal/ModalKeyboard";
import ModalGender from '../../Modal/ModalGender';
import ModalPsychiatrist from "../../Modal/ModalPsychiatrist";
import service from "../../../service";
import {futureReserves, todayReserves} from "../../../db";

class PageReserveFinalization extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {};

        this.ref = {
            modalNumberKeyboard: React.createRef(),
            modalNationality: React.createRef(),
            modalKeyboard: React.createRef(),
            modalInsureBox: React.createRef(),
            modalPayment: React.createRef(),
            modalGender: React.createRef(),
            modalPsychiatrist: React.createRef(),
            paymentPrint: React.createRef()
        };
    }

    componentDidMount() {
        super.componentDidMount();

        setTimeout(_ => {
            this.getUserData();
        }, 500);
    }

    render() {
        const {props} = this;
        const userDataEntry = props.base.userDataEntry;
        const nationality = {IRANIAN: 'ایرانی', FOREIGN: 'اتباع خارجی'}[userDataEntry.nationality];
        const foreignInsurance = {
            'true': 'دارای بیمه',
            'false': 'فاقد بیمه'
        }[userDataEntry.hasForeignInsurance?.toString()];
        const price = (userDataEntry.chargeAmount || 0) + (userDataEntry.priceAmount || 0);

        return <React.Fragment>
            <Page className={'PageReserveFinalization dis-f'} id={'PageReserveFinalization'}>
                {userDataEntry.darmangah === 'MORNING' ? <MenuCard title={'درمانگاه شیفت صبح را انتخاب کرده‌اید'}
                                                                   description={'کاربر عزیز درمانگاه شیفت صبح را انتخاب کرده‌اید از این مسئله مطمئن باشید.'}
                                                                   icon={Resource.IMAGE.DAY}/> : null}
                {userDataEntry.darmangah === 'EVENING' ? <MenuCard title={'درمانگاه شیفت عصر را انتخاب کرده‌اید'}
                                                                   description={'کاربر عزیز درمانگاه شیفت عصر را انتخاب کرده‌اید از این مسئله مطمئن باشید.'}
                                                                   icon={Resource.IMAGE.NIGHT}/> : null}
                {userDataEntry.darmangah === 'FUTURE' ? <MenuCard title={'تاریخ و ساعت نوبت'}
                                                                  description={'کاربر عزیز نوبت دهی روز های آینده را انتخاب کرده‌اید.'}
                                                                  icon={Resource.IMAGE.NIGHT}/> : null}
                <SpecialityCard
                    data={{...userDataEntry.speciality, name: `تخصص: ${userDataEntry.speciality?.name || ''}`}}/>
                <DoctorCard className={'mar-b-20'}
                            data={{...userDataEntry.doctor, name: `نام پزشک: ${userDataEntry.doctor?.name || ''}`}}/>

                <div className={'fb-20'}>
                    <CheckList className={'mar-b-20'} title={`ملیت بیمار: ${nationality || ' . . .'}`}
                               checked={Boolean(nationality)}/>
                    {userDataEntry.nationality !== 'FOREIGN' &&
                    <CheckList className={'mar-b-20'} title={`کد ملی بیمار: ${userDataEntry.nationalCode || ' . . .'}`}
                               checked={Boolean(userDataEntry.nationalCode)}/>}
                    {userDataEntry.nationality !== 'FOREIGN' && <CheckList className={'mar-b-20'}
                                                                           title={`نام بیمار: ${userDataEntry.firstName ? `${userDataEntry.firstName} ${userDataEntry.lastName}` : ' . . .'}`}
                                                                           checked={Boolean(userDataEntry.firstName)}/>}
                    {userDataEntry.nationality !== 'IRANIAN' &&
                    <CheckList className={'mar-b-20'} title={`بیمه بیمار: ${foreignInsurance || ' . . .'}`}
                               checked={Boolean(foreignInsurance)}/>}
                    {userDataEntry.nationality !== 'FOREIGN' && <CheckList className={'mar-b-20'}
                                                                           title={`بیمه بیمار: ${userDataEntry.standardInsurance?.name || userDataEntry.shafadocInsurance?.name || ' . . .'}`}
                                                                           checked={Boolean(userDataEntry.standardInsurance.name)}/>}
                    {userDataEntry.nationality !== 'FOREIGN' && <CheckList className={'mar-b-20'}
                                                                           title={`شماره بیمه بیمار: ${userDataEntry.shafadocInsurance.number || userDataEntry.standardInsurance.number || ' . . .'}`}
                                                                           checked={Boolean(userDataEntry.shafadocInsurance.name || userDataEntry?.standardInsurance?.number)}/>}
                    <CheckList className={''} title={`پرداخت فرانشیز بیمار: ${App.formatMoney(price)} ریال`}
                               checked={Boolean(userDataEntry.priceAmount)}/>
                </div>
                <div className="dis-f fb-20">
                    <div className="flex"/>
                    <Button className={'mar-t-20'} theme={'red'}
                            onClick={this.backClickHandler.bind(this)}>بازگشت</Button>
                </div>
            </Page>
            <ModalNationality refer={ref => this.ref.modalNationality = ref}/>
            <ModalGender refer={ref => this.ref.modalGender = ref}/>
            <ModalNumberKeyboard refer={ref => this.ref.modalNumberKeyboard = ref}/>
            <ModalPsychiatrist refer={ref => this.ref.modalPsychiatrist = ref}/>
            <ModalKeyboard refer={ref => this.ref.modalKeyboard = ref}/>
            <ModalInsureBox refer={ref => this.ref.modalInsureBox = ref}/>
            <ModalPayment refer={ref => this.ref.modalPayment = ref}/>
        </React.Fragment>;
    }

    backClickHandler() {
        const {props} = this;

        props.history.push(Resource.Route.HOME);
    }

    getUserData() {
        service.getPatientNationality({context: this})
            .then(nationality => {
                if (nationality === 'IRANIAN') {
                    this.queueNationalCode();
                } else if (nationality === 'FOREIGN') {
                    if (this.props.setting.foreignClientPrevent)
                        new Notif({message: this.props.setting.foreignClientPrevent, theme: 'error'}).show()
                    else
                        this.queueForeignPatient()
                }
            })
            .catch(err => console.log(err));
    }

    queueForeignPatient() {
        service.getForeignPatientCode({context: this})
            .then(code => {
                this.queueInsuranceInquiry();
            })
            .catch(err => console.log(err));
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
            .then(firstName => {
                this.userInfoCheckerBeforePayment();
            })
            .catch(err => console.log(err));
    }

    queueFirstName() {
        service.getPatientFirstName({context: this})
            .then(firstName => {
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
                this.queueReserve();
            })
            .catch(err => {
                console.log(err);

                this.queueReserve();
            });
    }

    queueInsuranceInquiry() {
        service.getPatientInsurance({context: this})
            .then(_ => {
                const {setting, base, updateUserDataEntry} = this.props;
                const {userDataEntry} = base;
                if (userDataEntry.nationality === 'FOREIGN' && userDataEntry.shafadocInsurance.id !== null) {
                    updateUserDataEntry({hasForeignInsurance: true})
                }

                if (setting.samadCodeInquiry && userDataEntry.standardInsurance.boxId === '26.4') {
                    this.queueSamadCode();
                } else
                    this.userInfoCheckerBeforePayment();
            })
            .catch(err => console.log(err));
    }

    queueLastName() {
        service.getPatientLastName({context: this})
            .then(firstName => {
                this.userInfoCheckerBeforePayment();
            })
            .catch(err => console.log(err));
    }

    queueMobile() {
        service.getPatientMobileNumber({context: this})
            .then(mobile => {
                this.userInfoCheckerBeforePayment();
            })
            .catch(err => console.log(err));
    }

    queueNationalCode() {
        service.getPatientNationalCode({context: this})
            .then(nationalCode => {
                this.queueInsuranceInquiry();
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
                    this.queueReserve();
                }
            })
            .catch(err => console.log(err));
    }

    queueReserve() {
        setTimeout(_ => {
            const {props} = this;
            const {setting} = props;
            const {userDataEntry} = props.base;

            if (userDataEntry.darmangah === 'FUTURE') {
                props.updateBase({loading: true});

                const body = {
                    turnNo: '0',
                    priceAmount: parseInt(userDataEntry.paymentData.priceAmount || 0),
                    ftId: userDataEntry.reserveTime.id,
                    codeMeli: userDataEntry.nationalCode,
                    mobile: userDataEntry.mobile,
                    saleReferenceId: userDataEntry.transactionId,
                    name: userDataEntry.firstName,
                    family: userDataEntry.lastName,
                    birthDate: userDataEntry.birthDate ? moment(userDataEntry.birthDate).format('jYYYY/jMM/jDD') : '',
                    gender: {MALE: '1', FEMALE: '0'}[userDataEntry.gender],
                    insureId: userDataEntry.shafadocInsurance.id,
                    insureNumber: userDataEntry.shafadocInsurance.number,
                    smsStatus: Boolean(setting.sendSmsOnReserve),
                    father: userDataEntry.fatherName,
                    token: null,
                    created_at: moment().format(),
                    send_at: moment().format(),
                    response: null,
                    finished: 'false'
                };

                api.getToken()
                    .then(token => {
                        console.log(token);
                        body.token = token;
                        props.updateUserDataEntry({token});

                        api.reserve(body).then(data => {
                            props.updateBase({loading: false});

                            body.response = data;

                            if (data?.resid) {
                                body.finished = 'true';
                                body.turnNo = data.turnNo;

                                futureReserves.insert(body);

                                props.updateUserDataEntry({
                                    reserveTime: {
                                        ...userDataEntry.reserveTime,
                                        id: data.resid,
                                        time: `${data.timeForRes}:00`
                                    },
                                    turnNo: data.turnNo
                                });

                                service.printReceipt({context: this});
                            } else {
                                body.finished = 'false';

                                futureReserves.insert(body);

                                new Notif({
                                    message: 'نوبت شما ثبت گردید لطفا در روز مراجعه قبض خود را از کیوسک دریافت نمایید.',
                                    theme: 'error'
                                }).show();

                                this.backClickHandler();
                            }
                        }).catch(err => {
                            props.updateBase({loading: false});

                            body.response = err;
                            body.finished = 'false';

                            futureReserves.insert(body);

                            new Notif({
                                message: 'نوبت شما ثبت گردید لطفا در روز مراجعه قبض خود را از کیوسک دریافت نمایید.',
                                theme: 'error',
                                duration: 3000
                            }).show();

                            this.backClickHandler();
                        })
                    })
                    .catch(err => {
                        props.updateBase({loading: false});

                        body.response = err;
                        body.finished = 'false';

                        futureReserves.insert(body);

                        new Notif({
                            message: 'نوبت شما ثبت گردید لطفا در روز مراجعه قبض خود را از کیوسک دریافت نمایید.',
                            theme: 'error',
                            duration: 3000
                        }).show();

                        this.backClickHandler();
                    });
            } else {
                signalR.reserve(userDataEntry.speciality?.id, userDataEntry.doctor?.id, userDataEntry.doctor?.tId, userDataEntry?.nationalCode || '')
                    .then(data => {
                        props.updateUserDataEntry({
                            resCount: data.ResCount,
                            startDailyResNo: data.StartDaily_Res_no,
                            localDailyResNo: data.localDaily_Res_no,
                            reserveDate: moment().format(),
                            reserveTime: {
                                time: userDataEntry.doctor.startTime
                            }
                        });

                        todayReserves.insert({
                            shafaDocUrl: setting.shafadocDomain,
                            nodeId: setting.nodeId,
                            docId: userDataEntry.doctor.id.toString(),
                            docCode: userDataEntry.doctor.code,
                            ofTime: userDataEntry.doctor.startTime,
                            specialtySlug: userDataEntry.doctor.spSlug.toString(),
                            patientCodeMelli: userDataEntry.nationalCode,
                            turnNo: userDataEntry.resCount || data.ResCount,
                            paymentAmount: userDataEntry.paymentData.priceAmount.toString(),
                            transactionId: userDataEntry.transactionId || '',
                            firstName: userDataEntry.firstName || '',
                            lastName: userDataEntry.lastName || '',
                            fatherFirstName: userDataEntry.fatherName || '',
                            birthDate: userDataEntry.birthDate ? moment(userDataEntry.birthDate).format('jYYYY/jMM/jDD') : '',
                            gender: {MALE: '1', FEMALE: '0'}[userDataEntry.gender] || '',
                            mobileNumber: userDataEntry.mobile || '',
                            insureId: userDataEntry.shafadocInsurance.id,
                            insureNumber: `${userDataEntry.standardInsurance.number || userDataEntry.shafadocInsurance.number || ''}${userDataEntry.samadCode ? `|${userDataEntry.samadCode}` : ''}`,
                            created_at: moment().format(),
                            send_at: null,
                            response: null
                        });

                        service.printReceipt({context: this});
                    });
            }
        }, 1000);
    }

    queueSabtAhvalInquiry() {
        const {props} = this;
        const {setting, base} = props;
        const {userDataEntry} = base;

        if (userDataEntry.nationalCode && userDataEntry.birthDate) {
            if (setting.DITAS && !setting.DIRECT_INQUIRY) {
                Main.person(userDataEntry.nationalCode, moment(userDataEntry.birthDate).format('jYYYY'), setting.personPath)
                    .then(data => {
                        props.updateUserDataEntry({
                            firstName: data.FirstName == '-' || !data.FirstName ? userDataEntry.firstName : data.FirstName,
                            lastName: data.LastName == '-' || !data.LastName ? userDataEntry.lastName : data.LastName,
                            fatherName: data.Father_FirstName == '-' || !data.Father_FirstName ? userDataEntry.fatherName : data.Father_FirstName,
                            gender: data.Gender ? data.Gender === '1' ? 'MALE' : 'FEMALE' : userDataEntry.gender
                        });
                    })
                    .catch(err => console.log(err));
            } else if (setting.DIRECT_INQUIRY || (setting.DIRECT_INQUIRY && setting.DITAS)) {
                api.getSabtAhvalData(userDataEntry.nationalCode, moment(userDataEntry.birthDate).format('jYYYYjMMjDD'))
                    .then(data => {
                        props.updateUserDataEntry({
                            firstName: data.FirstName == '-' || !data.FirstName ? userDataEntry.firstName : data.FirstName,
                            lastName: data.LastName == '-' || !data.LastName ? userDataEntry.lastName : data.LastName,
                            fatherName: data.Father_FirstName == '-' || !data.Father_FirstName ? userDataEntry.fatherName : data.Father_FirstName,
                            gender: data.Gender ? {
                                1: 'MALE',
                                2: 'FEMALE'
                            }[data.Gender.Coded_string] : userDataEntry.gender
                        });
                    })
                    .catch(err => {
                        console.log(err);
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

    queuePsychiatrist() {
        service.getPsychiatristVisitTime({context: this})
            .then(value => {
                this.queueServicePrice();
            })
            .catch(err => console.log(err));
    }

    userInfoCheckerBeforePayment() {
        const {props} = this;
        const {setting} = props;
        const {userDataEntry} = props.base;

        if (userDataEntry.birthDate && !userDataEntry.fatherName)
            this.queueSabtAhvalInquiry();

        if (!userDataEntry.birthDate)
            this.queueBirthdate();
        else if (!userDataEntry.firstName)
            this.queueFirstName();
        else if (!userDataEntry.lastName)
            this.queueLastName();
        else if (!userDataEntry.fatherName)
            this.queueFatherName();
        else if (!userDataEntry.gender)
            this.queueGender();
        else if (setting.patientMobile && !userDataEntry.mobile)
            this.queueMobile();
        //tId is used in Future Reserves and spId in jari Reserves (if an error given the condition will be )
        //(setting.getPsychiatristVisitTime && (((Number(setting.psychiatristId) === userDataEntry.doctor.tId && userDataEntry.darmangah === 'FUTURE')
        // || Number(setting.psychiatristId) === userDataEntry.doctor.spId))
        else if (setting.getPsychiatristVisitTime && (Number(setting.psychiatristId) === userDataEntry.doctor.tId || Number(setting.psychiatristId) === userDataEntry.doctor.spId))
            this.queuePsychiatrist();
        else
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
        addNationalCode: props => dispatch(addNationalCode(props)),
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props)),
        updateBase: props => dispatch(updateBase(props))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageReserveFinalization);