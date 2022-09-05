import App from "./App";
import moment from "jalali-moment";
import store from './Redux/store'
import {addNationalCode, updateUserDataEntry} from "./Redux/Actions/base";
import signalR from "./signalr";
import Resource from "./Resource";
import Main from "./ElectronLayer/Main";

class service {
    static generateHID({context}) {
        return new Promise((resolve, reject) => {
            const {props} = context;
            const {userDataEntry} = props.base;

            Main.generateHID(userDataEntry.nationalCode, userDataEntry.doctor?.code, userDataEntry.standardInsurance.id, userDataEntry.standardInsurance.inquiryId)
                .then(hid => {
                    if (context.unmounted)
                        return;

                    store.dispatch(updateUserDataEntry({hid}));

                    resolve(hid);
                })
                .catch(message => {
                    if (context.unmounted)
                        return;

                    reject('خطا رخ داد دوباره امتحان کنید.');
                });
        });
    }

    static getInternetResInfo({context, nationalCode}) {
        nationalCode = store.getState().base.userDataEntry.nationalCode || nationalCode;

        return new Promise((resolve, reject) => {
            signalR.getInternetResInfo(nationalCode)
                .then(data => {
                    const temp = {
                        type: {
                            'true|false': 'FULL_PAYED_APPOINTMENT',
                            'false|false': 'FREE_APPOINTMENT',
                            'false|true': 'TELL_APPOINTMENT',
                            'true|true': 'UNKNOWN_TYPE'
                        }[`${Boolean(data.paymentAmount)}|${Boolean(data.remainedPaymentAmount)}`],
                        nationalCode: data?.patientCodeMelli || nationalCode,
                        paymentAmount: data?.paymentAmount || null,
                        remainedPaymentAmount: data?.remainedPaymentAmount || null
                    };

                    //todo check incoming data
                    store.dispatch(updateUserDataEntry(temp));
                    // todo remove after big bang
                    store.dispatch(updateUserDataEntry({internetResInfo: data, nationalCode: data?.patientCodeMelli}));

                    App.log('service.getInternetResInfo', 'resolve', temp);
                    resolve(temp);
                })
                .catch(message => {
                    App.log('service.getInternetResInfo', `reject`, message);
                    reject(message);
                });
        });
    }

    static getPatientBirthDate({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalNumberKeyboard.current.open({
                key: 'birth',
                prompt: 'تاریخ تولد خود را وارد کنید',
                mask: '####/##/##',
                validator: value => {
                    try {
                        if (!value || !(moment(value, 'jYYYYjMMjDD', true).isValid()))
                            return 'تاریخ تولد صحیحی را وارد کنید.';
                    } catch (e) {
                        return 'تاریخ تولد صحیحی را وارد کنید.';
                    }

                    return true;
                }
            })
                .then(({key, value}) => {
                    value = value ? moment(value, 'jYYYYjMMjDD').format() : null;

                    store.dispatch(updateUserDataEntry({birthDate: value}));

                    App.log('service.getPatientBirthDate', `resolve`, value);
                    resolve(value);
                })
                .catch(_ => {
                    App.log('service.getPatientBirthDate', `reject`);
                    reject();
                });
        });
    }

    static getPatientFatherName({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalKeyboard.current.open({
                prompt: 'لطفا نام پدر بیمار را وارد نمایید.',
                validator: value => {
                    const {userDataEntry} = context.props.base;

                    if (userDataEntry.fatherName)
                        return true;

                    if (!value)
                        return 'نام پدر بیمار را وارد کنید.';

                    return true;
                }
            })
                .then(({value}) => {
                    const {userDataEntry} = context.props.base;

                    store.dispatch(updateUserDataEntry({fatherName: userDataEntry.fatherName || value}));

                    App.log('service.getPatientFatherName', `resolve`, value);
                    resolve(value);
                })
                .catch(_ => {
                    App.log('service.getPatientFatherName', `reject`);
                    reject();
                });
        });
    }

    static getPatientFirstName({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalKeyboard.current.open({
                prompt: 'لطفا نام بیمار را وارد نمایید.',
                validator: value => {
                    const {userDataEntry} = context.props.base;

                    if (userDataEntry.firstName)
                        return true;

                    if (!value)
                        return 'نام بیمار را وارد کنید.';

                    return true;
                }
            })
                .then(({value}) => {
                    const {userDataEntry} = context.props.base;

                    store.dispatch(updateUserDataEntry({firstName: userDataEntry.firstName || value}));

                    App.log('service.getPatientFirstName', `resolve`, value);
                    resolve(value);
                })
                .catch(_ => {
                    App.log('service.getPatientFirstName', `reject`);
                    reject();
                });
        });
    }

    static getPatientForeignInsurance({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalForeignInsurance.current.open()
                .then(flag => {
                    store.dispatch(updateUserDataEntry({hasForeignInsurance: flag}));

                    App.log('service.getPatientForeignInsurance', `resolve`, flag);

                    resolve(flag);
                })
                .catch(_ => {
                    App.log('service.getPatientForeignInsurance', `reject`);

                    reject();
                });
        });
    }

    static getPatientGender({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalGender.current.open()
                .then(value => {
                    const {userDataEntry} = context.props.base;

                    store.dispatch(updateUserDataEntry({gender: !['MALE', 'FEMALE'].includes(userDataEntry.gender) ? value : userDataEntry.gender}));

                    App.log('service.getPatientGender', `resolve`, value);

                    resolve(value);
                })
                .catch(_ => {
                    App.log('service.getPatientGender', `reject`);

                    reject();
                });
        });
    }

    static getPsychiatristVisitTime({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalPsychiatrist.current.open()
                .then(value => {

                    store.dispatch(updateUserDataEntry({firstTimePsychiatristVisit: value === 'YES' ? true : false}));

                    App.log('service.getPsychiatristVisitTime', `resolve`, value);

                    resolve(value);
                })
                .catch(_ => {
                    App.log('service.getPsychiatristVisitTime', `reject`);

                    reject();
                });
        });
    }

    static getPatientInsurance({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalInsureBox.current.open()
                .then(data => {
                    console.log(data)
                    store.dispatch(updateUserDataEntry({insurance: data}));

                    App.log('service.getPatientInsurance', `resolve`, data);
                    resolve(data);
                })
                .catch(_ => {
                    App.log('service.getPatientInsurance', `reject`);
                    reject();
                });
        });
    }

    static getPatientLastName({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalKeyboard.current.open({
                prompt: 'لطفا نام خانوادگی بیمار را وارد نمایید.',
                validator: value => {
                    const {userDataEntry} = context.props.base;

                    if (userDataEntry.lastName)
                        return true;

                    if (!value)
                        return 'نام خانوادگی بیمار را وارد کنید.';

                    return true;
                }
            })
                .then(({value}) => {
                    const {userDataEntry} = context.props.base;

                    store.dispatch(updateUserDataEntry({lastName: userDataEntry.lastName || value}));

                    App.log('service.getPatientLastName', `resolve`, value);
                    resolve(value);
                })
                .catch(_ => {
                    App.log('service.getPatientLastName', `reject`);
                    reject();
                });
        });
    }

    static getPatientMobileNumber({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalNumberKeyboard.current.open({
                key: 'mobile',
                prompt: 'لطفا شماره موبایل بیمار را وارد کنید.',
                validator: value => {
                    if (!App.isMobile(value)) {
                        return 'شماره موبایل بیمار وارد نشده است.';
                    }
                    return true;
                }
            })
                .then(({value}) => {
                    store.dispatch(updateUserDataEntry({mobile: value}));

                    App.log('service.getPatientMobileNumber', `resolve`, value);
                    resolve(value);
                })
                .catch(_ => {
                    App.log('service.getPatientMobileNumber', `reject`);
                    reject();
                });
        });
    }

    static getForeignPatientCode({context}) {
        // const {base, setting} = store.getState();

        return new Promise((resolve, reject) => {
            context.ref.modalNumberKeyboard.current.open({
                key: 'foreignCode',
                prompt: 'لطفا کد اتباع بیمار را وارد نمایید.',
                validator: value => {
                    if (!value)
                        return 'کد اتباع بیمار را وارد کنید.';

                    // eslint-disable-next-line eqeqeq
                    return true;
                }
            })
                .then(({key, value}) => {
                    store.dispatch(addNationalCode(value));
                    store.dispatch(updateUserDataEntry({nationalCode: value}));

                    App.log('service.getPatientNationalCode', `resolve`, value);
                    resolve(value);
                })
                .catch(_ => {
                    App.log('service.getPatientNationalCode', `reject`);
                    reject();
                });
        });
    }

    static getPatientNationalCode({context}) {
        const {base, setting} = store.getState();

        return new Promise((resolve, reject) => {
            context.ref.modalNumberKeyboard.current.open({
                key: 'nationalCode',
                prompt: 'لطفا کد ملی بیمار را وارد نمایید.',
                validator: value => {
                    if (setting.nationalCodeValidationCheck && !App.isNationalCode(value))
                        return 'کد ملی بیمار معتبر نیست.';

                    if (!value)
                        return 'کد ملی بیمار را وارد کنید.';

                    // eslint-disable-next-line eqeqeq
                    const nationalCode = base.nationalCodes.find(item => item.code == value);

                    if (setting.nationalCodeUsageLimit
                        // eslint-disable-next-line eqeqeq
                        && moment(base.nationalCodeListDate, 'jYYYY-jMM-jDD').diff(moment(), 'days') == 0
                        && nationalCode
                        && nationalCode.count >= setting.nationalCodeUsageLimit)
                        return 'دفعات مجاز استفاده از سامانه برای کد ملی شما به پایان رسیده است.';

                    return true;
                }
            })
                .then(({key, value}) => {
                    store.dispatch(addNationalCode(value));
                    store.dispatch(updateUserDataEntry({nationalCode: value}));

                    App.log('service.getPatientNationalCode', `resolve`, value);
                    resolve(value);
                })
                .catch(_ => {
                    App.log('service.getPatientNationalCode', `reject`);
                    reject();
                });
        });
    }

    static getPatientNationality({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalNationality.current.open()
                .then(value => {
                    store.dispatch(updateUserDataEntry({nationality: value}));

                    App.log('service.getPatientNationality', `resolve`, value);

                    resolve(value);
                })
                .catch(_ => {
                    App.log('service.getPatientNationality', `reject`);

                    reject();
                });
        });
    }

    static getPatientSamadCode({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalNumberKeyboard.current.open({
                key: 'samadCode',
                prompt: 'لطفا کد رهگیری بیمار را وارد نمایید.',
                validator: value => {
                    if (!value)
                        return 'کد رهگیری بیمار را وارد کنید.';

                    return true;
                }
            })
                .then(({value}) => {
                    store.dispatch(updateUserDataEntry({samadCode: value}));

                    App.log('service.getPatientSamadCode', `resolve`, value);
                    resolve(value);
                })
                .catch(_ => {
                    App.log('service.getPatientSamadCode', `reject`);
                    reject();
                });
        });
    }

    static getServicePriceAmount({context}) {
        return new Promise((resolve, reject) => {
            const {props} = context
            const {userDataEntry} = props.base;
            const {setting} = props;
            let insuranceId = null;

            props.updateBase({loading: true});
            insuranceId = userDataEntry.shafadocInsurance.id;

            signalR.getPriceAmount(userDataEntry.doctor.id, insuranceId)
                .then(data => {
                    const body = {
                        paymentData: {
                            priceAmount: data.priceAmount,
                            chargeAmount: data.charge,
                            chargePin: data.chargePin,
                            payPin: data.payPin
                        }
                    };
                    console.log(body)

                    store.dispatch(updateUserDataEntry(body));

                    if (userDataEntry.nationality === 'IRANIAN') {
                        const age = moment().diff(moment(userDataEntry.birthDate), 'year');
                        console.log('age =>', age);

                        if (age < 7 && !userDataEntry.firstTimePsychiatristVisit) {
                            Main.getPriceAmount(setting.nodeId.toString(), userDataEntry.doctor.id.toString(), userDataEntry.shafadocInsurance.id, age.toString(), body.paymentData.priceAmount.toString(), setting.shafadocKoudakDomain)
                                .then(data => {
                                    props.updateBase({loading: false});

                                    console.log('under 7 visit price', data);

                                    if (parseInt(data.result))
                                        body.paymentData.priceAmount = parseInt(data.result);

                                    store.dispatch(updateUserDataEntry(body));
                                    resolve(body);
                                })
                                .catch(message => {
                                    resolve(body);
                                });
                        }
                        if (userDataEntry.firstTimePsychiatristVisit) {
                            Main.getPsychoPriceAmount(setting.nodeId.toString(), userDataEntry.doctor.id.toString(), userDataEntry.shafadocInsurance.id, body.paymentData.priceAmount.toString(), setting.shafadocKoudakDomain)
                                .then(data => {
                                    props.updateBase({loading: false});

                                    console.log('first time psychiatrist visit', data);

                                    if (parseInt(data.result))
                                        body.paymentData.priceAmount = parseInt(data.result);

                                    store.dispatch(updateUserDataEntry(body));
                                    resolve(body);
                                })
                                .catch(message => {
                                    resolve(body);
                                });
                        } else {
                            props.updateBase({loading: false});

                            resolve(body);
                        }
                    } else {
                        props.updateBase({loading: false});

                        resolve(body);
                    }
                })
                .catch(err => {
                    props.updateBase({loading: false});

                    reject(err);
                });
        });
    }

    static printReceipt({context}) {
        setTimeout(_ => {
            if (context.props.history) {
                context.props.history.push(Resource.Print.RECEIPT);
            } else {
                console.error("خطا: کلاس مورد نظر فاقد توابع routing می باشد.");
            }
        }, 500);
    }

    static sendPatientForPayment({context}) {
        return new Promise((resolve, reject) => {
            context.ref.modalPayment.current.open()
                .then(_ => {
                    App.log('service.sendPatientForPayment', `resolve`);

                    resolve();
                })
                .catch(_ => {
                    App.log('service.sendPatientForPayment', `reject`);

                    reject();
                });
        });
    }
}

export default service;