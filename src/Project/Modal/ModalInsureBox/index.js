/* eslint eqeqeq: off */
import React from 'react';
import Modal, {ModalContent} from '../../../Components/Modal';
import MyComponent from '../../../Components/MyComponent';
import Button from '../../../Components/Button';
import Input from '../../../Components/Input';
import {connect} from 'react-redux';
import ItemCard from '../../ItemCard';
import Notif from '../../../Components/Notif';
import './index.css';
import Main from "../../../ElectronLayer/Main";
import {updateUserDataEntry} from "../../../Redux/Actions/base";
import Resource from "../../../Resource";
import BackToMainMenu from "../../../backToMainMenu";
import {withRouter} from "react-router-dom";
import App from "../../../App";
import moment from "jalali-moment";
import {api} from "../../../api";

class ModalInsureBox extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            fields: {},
            loading: true,
            confirm: false,
            insuranceMap: {},
            foreignMap: {}
        };

        this.ref = {
            modal: React.createRef(),
            insuranceNumber: React.createRef(),
            close: React.createRef(),
            submit: React.createRef(),
            input: React.createRef()
        };
    }

    componentDidMount() {
        super.componentDidMount();

        const {props} = this;
        const {setting} = props;
        props.refer({current: this});

        Main.getInsuranceMap(setting.insuranceMapPath)
            .then(data => {
                this.setState({insuranceMap: data});
            })
            .catch(err => {
                alert('فایل نقشه بیمه پیدا نشد.');
            });
        Main.getForeignMap(setting.foreignMapPath)
            .then(data => {
                this.setState({foreignMap: data});
            })
            .catch(err => {
                alert('فایل نقشه بیمه اتباع پیدا نشد.');
                console.log(err)
            });

        this.setState({loading: true});
    }

    render() {
        const {state, props} = this;
        const {setting, base} = props;
        const {fields} = state;
        const freeInsurers = [4, 71, 1]; // لیست گزینه‌هایی که نیاز به دریافت شماره بیمه ندارد
        const needInsuranceNumber = fields.insurance && !freeInsurers.includes(fields.insurance?.id);

        if (!state.loading && !state.confirm && base.userDataEntry.nationality === 'FOREIGN' && !setting.showForeignInsuranceList) {
            props.updateUserDataEntry({
                shafadocInsurance: {
                    id: setting.foreigenerCodeAzad,
                    name: 'اتباع خارجه آزاد',
                    number: 0
                }
            })
            this.close(true);
            return;
        }

        return <Modal
            required={true}
            ref={this.ref.modal}
            name={'ModalInsureBox'}
            size={needInsuranceNumber ? 'large' : 'medium'}>
            {state.loading ?
                <ModalContent onClick={_ => BackToMainMenu.resetTimer()}>
                    <div className={'pad-v-20 pad-h-8 dis-f'}><img className={'loader'}
                                                                   src={Resource.IMAGE.LOADER.BLACK} alt=""/><h3
                        style={{fontSize: '20px'}}>در حال استعلام بیمه، لطفا منتظر بمانید...</h3></div>
                    <div className={'dis-f'}>
                        <Button ref={this.ref.close} className={'flex mar-4'} onClick={this.backToMainMenu.bind(this)}
                                theme="red">بازگشت {state.timer}</Button>
                    </div>
                </ModalContent> : null}
            {state.confirm ?
                <ModalContent onClick={_ => BackToMainMenu.resetTimer()}>
                    <div className={'pad-v-20 pad-h-8 dis-f'}><h3 style={{fontSize: '20px'}}>در این لحظه امکان استعلام
                        بیمه وجود ندارد. در صورت ادامه، هزینه به صورت <span
                            style={{color: 'var(--goo-red)'}}>آزاد</span> محاسبه خواهد شد.</h3></div>
                    <div className={'dis-f'}>
                        <Button className={'flex mar-4'} onClick={this.confirmed.bind(this)}
                                theme="green">ادامه</Button>
                        <Button className={'flex mar-4'} onClick={this.backToMainMenu.bind(this, false)}
                                theme="red">بازگشت {state.timer}</Button>
                    </div>
                </ModalContent> : null}
            {!state.loading && !state.confirm ? <ModalContent onClick={_ => BackToMainMenu.resetTimer()}>
                <div className={'dis-f'} style={{flexDirection: 'column'}}>
                    <div className={'pad-8'}><h3 style={{fontSize: '20px'}}>لطفا بیمه خود را انتخاب کنید.</h3></div>
                    <div className="dis-f">
                        <div className={'List fb-10'}>
                            {this.props.base.userDataEntry.nationality === 'FOREIGN' ? this.props.base.insurances.filter(item => Object.values(this.state.foreignMap).includes(item.id.toString())).map((item, i) => {
                                return <ItemCard key={i} data={item} selected={fields.insurance?.id == item.id}
                                                 onClick={this.clickEvent.bind(this)} title={item.name}/>
                            }) : this.props.base.insurances.filter(item => !(Object.values(this.state.foreignMap).includes(item.id.toString()))).map((item, i) => {
                                return <ItemCard key={i} data={item} selected={fields.insurance?.id == item.id}
                                                 onClick={this.clickEvent.bind(this)} title={item.name}/>;
                            })}
                        </div>
                        {needInsuranceNumber &&
                            <div className={'Keyboard dis-f fb-10'} style={{flexDirection: 'column', width: '100%'}}>
                                <Input ref={this.ref.insuranceNumber} className={'pad-4'} align={'center'}
                                       direction={'ltr'}
                                       placeholder={'شماره بیمه'} type="number" value={fields.insuranceNumber}
                                       style={{fontSize: '30px'}}
                                       onChange={this.setField.bind(this, 'insuranceNumber')}/>
                                <div className={'dis-f'}>
                                    <Button className={'flex calculate mar-4'}
                                            onClick={this.keyboardClickHandler.bind(this, '3')} theme="blue">3</Button>
                                    <Button className={'flex calculate mar-4'}
                                            onClick={this.keyboardClickHandler.bind(this, '2')} theme="blue">2</Button>
                                    <Button className={'flex calculate mar-4'}
                                            onClick={this.keyboardClickHandler.bind(this, '1')} theme="blue">1</Button>
                                </div>
                                <div className={'dis-f'}>
                                    <Button className={'flex calculate mar-4'}
                                            onClick={this.keyboardClickHandler.bind(this, '6')} theme="blue">6</Button>
                                    <Button className={'flex calculate mar-4'}
                                            onClick={this.keyboardClickHandler.bind(this, '5')} theme="blue">5</Button>
                                    <Button className={'flex calculate mar-4'}
                                            onClick={this.keyboardClickHandler.bind(this, '4')} theme="blue">4</Button>
                                </div>
                                <div className={'dis-f'}>
                                    <Button className={'flex calculate mar-4'}
                                            onClick={this.keyboardClickHandler.bind(this, '9')} theme="blue">9</Button>
                                    <Button className={'flex calculate mar-4'}
                                            onClick={this.keyboardClickHandler.bind(this, '8')} theme="blue">8</Button>
                                    <Button className={'flex calculate mar-4'}
                                            onClick={this.keyboardClickHandler.bind(this, '7')} theme="blue">7</Button>
                                </div>
                                <div className={'dis-f'}>
                                    <Button className={'flex calculate mar-4'}
                                            onClick={this.keyboardClickHandler.bind(this, '0')} theme="blue">0</Button>
                                </div>
                                <div className="flex"/>
                                <div className={'dis-f'}>
                                    <Button className={'flex mar-4'} onClick={this.submit.bind(this)}
                                            theme="green">ثبت</Button>
                                    <Button className={'flex mar-4'} onClick={this.backToMainMenu.bind(this)}
                                            theme="red">بازگشت {state.timer}</Button>
                                </div>
                            </div>}
                    </div>
                    {!needInsuranceNumber && <div className={'dis-f'}>
                        <Button ref={this.ref.submit} className={'flex mar-4'} onClick={this.submit.bind(this)}
                                theme="green">ثبت</Button>
                        <Button ref={this.ref.close} className={'flex mar-4'}
                                onClick={this.backToMainMenu.bind(this, false)}
                                theme="red">بازگشت {state.timer}</Button>
                    </div>}
                </div>
            </ModalContent> : null}
        </Modal>;
    }

    backToMainMenu() {
        const {props} = this;

        this.close(false);

        setTimeout(_ => {
            props.history.push(Resource.Route.HOME);
        }, 500);
    }

    clickEvent(data) {
        const fields = this.state.fields;

        fields.insurance = data;

        this.setState({fields}, _ => {
            if (this.ref.input.current) {
                this.ref.input.current.focus();
            }
        });
    }

    close(success) {
        const {state} = this;
        BackToMainMenu.clearTimer();

        this.ref.modal.current.close();

        if (success === true)
            state.resolve();
        else
            state.reject();
    }

    confirmed() {
        this.props.updateUserDataEntry({
            shafadocInsurance: {
                id: 1,
                name: "آزاد",
                number: null,
                insurer: 0
            }
        });

        this.close(true);
    }

    keyboardClickHandler(char) {
        const fields = {...this.state.fields};

        fields.insuranceNumber = (fields.insuranceNumber || '') + char;

        this.setState({fields}, _ => {
            this.ref.insuranceNumber.current.focus();
        });
    }

    mapInsurance(insuranceId, insuranceBoxId) {
        const map = this.state.insuranceMap || {};

        console.trace('mapping', insuranceId, insuranceBoxId, 'to', map?.[insuranceId]?.[insuranceBoxId] || map?.[insuranceId]?.['else'] || '1')
        return map?.[insuranceId]?.[insuranceBoxId] || map?.[insuranceId]?.['else'] || '1';
    }

    open(data, action) {
        return new Promise((resolve, reject) => {
            const {props} = this;

            BackToMainMenu.setTimer(this);

            this.setState({
                resolve,
                reject,
                data,
                action,
                fields: {},
                error: null,
                loading: true
            });

            setTimeout(_ => {
                const {setting, base} = props;

                if (setting.DITAS && !setting.DIRECT_INQUIRY) {
                    Main.callUpInsurance(App.storage.get('redux', {}).base.userDataEntry.nationalCode, setting.resultPath)
                        .then(data => {
                            if (this.unmounted)
                                return;
                            const {userDataEntry} = this.props.base;

                            console.log(data);

                            if (data?.message !== 'SUCCESS' && base.userDataEntry.nationality === 'IRANIAN')
                                this.setState({loading: false});
                            else if (!(data?.response?.result?.data?.isSuccess) && base.userDataEntry.nationality === 'FOREIGN')
                                this.close(true)

                            else if (data.code === 1 || data.code === 2) {
                                const mapResult = this.mapInsurance(
                                    data.data[0].Insurer.Coded_string || userDataEntry.standardInsurance.id,
                                    data.data[0].InsurerBox.Coded_string || userDataEntry.standardInsurance.boxId
                                );

                                this.props.updateUserDataEntry({
                                    firstName: data.data[0].FirstName || userDataEntry.firstName,
                                    lastName: data.data[0].LastName || userDataEntry.lastName,
                                    birthDate: data.data[0].BirthDate.ISOString ? moment(data.data[0].BirthDate.ISOString, 'jYYYY/jMM/jDD').format() : userDataEntry.birthDate,
                                    gender: {
                                        1: 'MALE',
                                        2: 'FEMALE'
                                    }[data.data[0].Gender.Coded_string] || userDataEntry.gender,
                                    standardInsurance: {
                                        id: data.data[0].Insurer.Coded_string || userDataEntry.standardInsurance.id,
                                        name: data.data[0].Insurer.Value || userDataEntry.standardInsurance.name,
                                        boxId: data.data[0].InsurerBox.Coded_string || userDataEntry.standardInsurance.boxId,
                                        boxName: data.data[0].InsurerBox.Value || userDataEntry.standardInsurance.boxName,
                                        number: data.data[0].InsuranceNumber.ID || userDataEntry.standardInsurance.number,
                                        expire: data.data[0].ExpirationDate.ISOString ? moment(data.data[0].ExpirationDate.ISOString, 'jYYYY/jMM/jDD').format() : userDataEntry.expire,
                                        inquiryId: data.data[0].inquiryId || userDataEntry.standardInsurance.number
                                    },
                                    shafadocInsurance: {
                                        id: mapResult,
                                        name: data.data[0].Insurer.Value || userDataEntry.standardInsurance.name,
                                        number: data.data[0].InsuranceNumber.ID || userDataEntry.standardInsurance.number
                                    }
                                });

                                this.close(true);
                            } else {
                                const rgx = new RegExp('[آءآ!اُبپتثجچحخدذرزژسشصضطظعغفقلکگکلمنوهی، ]+[.]*', 'g');
                                const message = data.data.match(rgx).join(' ').trim();

                                if (message) {
                                    new Notif({message, theme: 'error'}).show();
                                }

                                this.setState({loading: false});
                            }
                        })
                        .catch(message => {
                            console.log(message);
                            if (this.unmounted)
                                return;
                            if (base.userDataEntry.nationality === 'IRANIAN')
                                this.setState({loading: false});
                            else this.close(true)
                        });
                } else if (setting.DIRECT_INQUIRY || (setting.DITAS && setting.DIRECT_INQUIRY)) {
                    const {userDataEntry} = this.props.base;
                    const {setting} = this.props;
                    api.getInsuranceDataByDitas2(App.storage.get('redux', {}).base.userDataEntry.nationalCode)
                        .then(data => {
                            if (this.unmounted)
                                return;

                            console.log(data)
                            if (data.type === 'ditas2') {
                                if (!(data?.response?.result?.data?.isSuccess) || data?.response?.resCode === -12305) {
                                    if (setting.SALAMAT_INQUIRY) {
                                        this.getSalamatData(App.storage.get('redux', {}).base.userDataEntry.nationalCode)
                                    } else {
                                        if (userDataEntry.nationality === 'IRANIAN') {
                                            this.setState({loading: false});
                                        } else {
                                            if (!setting.showForeignInsuranceList) {
                                                this.props.updateUserDataEntry({
                                                    shafadocInsurance: {
                                                        id: this.props.setting.foreigenerCodeAzad,
                                                        name: 'اتباع خارجه آزاد',
                                                        number: 0
                                                    }
                                                })
                                                this.close(true)
                                            } else {
                                                this.setState({loading: false})
                                            }
                                        }
                                    }
                                } else {
                                    const mapResult = this.mapInsurance(
                                        data.response.result.data.data[0].insurer.coded_string || userDataEntry.standardInsurance.id,
                                        data.response.result.data.data[0].insurerBox.coded_string || userDataEntry.standardInsurance.boxId
                                    );
                                    this.props.updateUserDataEntry({
                                        firstName: data.response.result.data.data[0].firstName || userDataEntry.firstName,
                                        lastName: data.response.result.data.data[0].lastName || userDataEntry.lastName,
                                        birthDate: data.response.result.data.data[0].birthDate.isoString ? moment(data.response.result.data.data[0].birthDate.isoString, 'jYYYY/jMM/jDD').format() : userDataEntry.birthDate,
                                        gender: {
                                            1: 'MALE',
                                            2: 'FEMALE'
                                        }[data.response.result.data.data[0].gender.coded_string] || userDataEntry.gender,
                                        standardInsurance: {
                                            id: data.response.result.data.data[0].insurer.coded_string || userDataEntry.standardInsurance.id,
                                            name: data.response.result.data.data[0].insurer.value || userDataEntry.standardInsurance.name,
                                            boxId: data.response.result.data.data[0].insurerBox.coded_string || userDataEntry.standardInsurance.boxId,
                                            boxName: data.response.result.data.data[0].insurerBox.value || userDataEntry.standardInsurance.boxName,
                                            number: data.response.result.data.data[0].insuranceNumber.id || userDataEntry.standardInsurance.number,
                                            expire: data.response.result.data.data[0].expirationDate.isoString ? moment(data.response.result.data.data[0].expirationDate.isoString, 'jYYYY/jMM/jDD').format() : userDataEntry.expire,
                                            inquiryId: data.response.result.data.data[0].inquiryID || userDataEntry.standardInsurance.number
                                        },
                                        shafadocInsurance: {
                                            id: mapResult,
                                            name: data.response.result.data.data[0].insurer.value || userDataEntry.standardInsurance.name,
                                            number: data.response.result.data.data[0].insuranceNumber.id || userDataEntry.standardInsurance.number
                                        }
                                    });
                                    this.close(true)
                                }
                            } else {
                                if (setting.SALAMAT_INQUIRY) {
                                    this.getSalamatData(App.storage.get('redux', {}).base.userDataEntry.nationalCode)
                                } else {
                                    if (userDataEntry.nationality === 'IRANIAN') {
                                        this.setState({loading: false});
                                    } else {
                                        if (!setting.showForeignInsuranceList) {
                                            this.props.updateUserDataEntry({
                                                shafadocInsurance: {
                                                    id: this.props.setting.foreigenerCodeAzad,
                                                    name: 'اتباع خارجه آزاد',
                                                    number: 0
                                                }
                                            })
                                            this.close(true)
                                        } else {
                                            this.setState({loading: false})
                                        }
                                    }
                                }
                            }
                        }).catch(err => {
                        console.log(err);
                        if (setting.SALAMAT_INQUIRY) {
                            this.getSalamatData(App.storage.get('redux', {}).base.userDataEntry.nationalCode)
                        } else {
                            if (userDataEntry.nationality === 'IRANIAN') {
                                this.setState({loading: false});
                            } else {
                                if (!setting.showForeignInsuranceList) {
                                    this.props.updateUserDataEntry({
                                        shafadocInsurance: {
                                            id: this.props.setting.foreigenerCodeAzad,
                                            name: 'اتباع خارجه آزاد',
                                            number: 0
                                        }
                                    })
                                    this.close(true)
                                } else {
                                    this.setState({loading: false})
                                }
                            }
                        }
                    })

                }
            }, 1000);

            this.ref.modal.current.open();
        });
    }

    submit(action) {
        const {fields} = this.state;
        const freeInsurers = [4, 71, 1]; // لیست گزینه‌هایی که نیاز به دریافت شماره بیمه ندارد
        const needInsuranceNumber = fields.insurance && !freeInsurers.includes(fields.insurance?.id);

        //شماره بیمه نمی خواد
        if (fields.insurance && freeInsurers.includes(fields.insurance?.id)) {
            setTimeout(() => {
                this.props.updateUserDataEntry({
                    shafadocInsurance: {
                        id: fields.insurance?.id,
                        name: fields.insurance?.name,
                        insurer: fields.insurance?.thritaEHR_Insurer,
                        number: fields.insurance?.number
                    }
                });
            }, 2000)
            this.close(true);
            // باید شماره و اسم بیمه انتخاب بشه
        } else {
            if (fields.insurance === undefined) {
                new Notif({message: 'لطفا بیمه خود را انتخاب کنید.', theme: 'error'}).show();
                return;
            }

            if (needInsuranceNumber && !fields.insuranceNumber) {
                new Notif({message: 'لطفا شماره بیمه خود را انتخاب کنید.', theme: 'error'}).show();
                return;
            }

            if ([1, 2].includes(fields.insurance?.thritaEHR_Insurer)) {
                this.setState({confirm: true});
                return;
            }


            this.props.updateUserDataEntry({
                shafadocInsurance: {
                    id: fields.insurance.id,
                    name: fields.insurance.name,
                    number: fields.insuranceNumber,
                    insurer: fields.insurance.thritaEHR_Insurer
                }
            });

            this.close(true);
        }
    };

    getSalamatData(nationalCode) {
        const {userDataEntry} = this.props.base;
        const {setting} = this.props;
        api.getInsuranceDataBySalamat(nationalCode)
            .then(data => {
                if (data.type === 'salamat') {
                    if ((data?.response?.info === null && userDataEntry.nationality === 'IRANIAN') ||
                        (data?.response?.info?.productName === 'فاقد پوشش بیمه' && userDataEntry.nationality === 'IRANIAN') ||
                        (data?.response?.resCode === -12305 && userDataEntry.nationality === 'IRANIAN')
                    )
                        this.setState({loading: false});
                    else if ((data?.response?.info === null && userDataEntry.nationality === 'FOREIGN') ||
                        (data?.response?.info?.productName === 'فاقد پوشش بیمه' && userDataEntry.nationality === 'FOREIGN') ||
                        (data?.response?.resCode === -12305 && userDataEntry.nationality === 'FOREIGN')
                    ) {
                        if (!setting.showForeignInsuranceList) {
                            this.props.updateUserDataEntry({
                                shafadocInsurance: {
                                    id: this.props.setting.foreigenerCodeAzad,
                                    name: 'اتباع خارجه آزاد',
                                    number: 0
                                }
                            })
                            this.close(true)
                        } else {
                            this.setState({loading: false})
                        }
                    } else {
                        const mapResult = this.mapInsurance(
                            data?.response?.info?.productId.toString() || userDataEntry.standardInsurance.id,
                            data?.response?.info?.productName || userDataEntry.standardInsurance.boxId
                        );
                        this.props.updateUserDataEntry({
                            firstName: data?.response?.info?.name || userDataEntry.firstName,
                            lastName: data?.response?.info?.lastName || userDataEntry.lastName,
                            birthDate: data?.response?.info?.birthDate ? moment(data?.response?.info?.birthDate, 'jYYYY/jMM/jDD').format() : userDataEntry.birthDate,
                            gender: {
                                'M': 'MALE',
                                'F': 'FEMALE'
                            }[data?.response?.info?.gender] || userDataEntry.gender,
                            standardInsurance: {
                                id: data?.response?.info?.productId?.toString() || userDataEntry.standardInsurance.id,
                                name: data?.response?.result?.data.data[0].insurer.value || userDataEntry.standardInsurance.name,
                                boxId: data?.response?.info?.productId || userDataEntry.standardInsurance.boxId,
                                boxName: data?.response?.info?.productName || userDataEntry.standardInsurance.boxName,
                                number: data?.response?.result?.data.data[0].insuranceNumber.id || userDataEntry.standardInsurance.number,
                                expire: data?.response?.result?.data.data[0].expirationDate.isoString ? moment(data?.response?.result?.data.data[0].expirationDate.isoString, 'jYYYY/jMM/jDD').format() : userDataEntry.expire,
                                inquiryId: data?.response?.result?.data.data[0].inquiryID || userDataEntry.standardInsurance.number
                            },
                            shafadocInsurance: {
                                id: mapResult,
                                name: data?.response?.result?.data.data[0].insurer.value || userDataEntry.standardInsurance.name,
                                number: data?.response?.result?.data.data[0].insuranceNumber.id || userDataEntry.standardInsurance.number
                            }
                        });
                        this.close(true)
                    }
                } else {
                    if (userDataEntry.nationality === 'IRANIAN')
                        this.setState({loading: false})
                    else {
                        if (!setting.showForeignInsuranceList) {
                            this.props.updateUserDataEntry({
                                shafadocInsurance: {
                                    id: this.props.setting.foreigenerCodeAzad,
                                    name: 'اتباع خارجه آزاد',
                                    number: 0
                                }
                            })
                            this.close(true)
                        } else {
                            this.setState({loading: false})
                        }
                    }
                }
            })
            .catch(err => {
                if (userDataEntry.nationality === 'IRANIAN')
                    this.setState({loading: false})
                else {
                    if (!setting.showForeignInsuranceList) {
                        this.props.updateUserDataEntry({
                            shafadocInsurance: {
                                id: this.props.setting.foreigenerCodeAzad,
                                name: 'اتباع خارجه آزاد',
                                number: 0
                            }
                        })
                        this.close(true)
                    } else {
                        this.setState({loading: false})
                    }
                }
            })
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
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ModalInsureBox));