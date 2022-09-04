import MyComponent from './Components/MyComponent';
import {Route, Switch, withRouter} from 'react-router-dom';
import React from 'react';
import './Resource/Stylesheets/Layout.css';
import signalR from './signalr';
import Resource from './Resource';
import {connect} from 'react-redux';
import {resetUserDataEntry, updateBase} from './Redux/Actions/base';
import PageMain from './Project/Page/PageMain';
import PageDarmangah from './Project/Page/PageDarmangah';
import PageSpecialities from './Project/Page/PageSpecialities';
import PageTest from './Project/Page/PageTest';
import PageDoctors from './Project/Page/PageDoctors';
import PageReserveFinalization from './Project/Page/PageReserveFinalization';
import {api} from './api';
import ReportReceipt from './Project/ReportReceipt';
import PageSetting from "./Project/Page/PageSetting";
import Splashscreen from "./Components/Splashscreen";
import PageTellFinalization from "./Project/Page/PageTellFinalization";
import Main from "./ElectronLayer/Main";
import PageCalendar from "./Project/Page/PageCalendar";
import PageDoctorTime from "./Project/Page/PageDoctorTime";
import moment from "jalali-moment";
import {futureReserves, todayReserves} from "./db";
import PageQueue from "./Project/Page/PageQueue";

class Layout extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            splashScreen: false,
            edgeShift: {}
        };
    }

    componentDidMount() {
        const {setting} = this.props;
        console.log(setting);
        window.setting = setting;


        if (setting.edgeShiftPath) {
            fetch(setting.edgeShiftPath)
                .then(response => response.json())
                .then(data => {
                    this.setState({edgeShift: data});
                })
                .catch(err => console.log(err));
        }


        api.getInsuranceList()
            .then(list => {
                this.props.updateBase({insurances: list});
            })
            .catch(message => {
                console.log(message);
            });

        setInterval(_ => {
            console.log('run');

            if (!this.state.sending)
                this.sendReserveToShafadoc();
        }, 60000); // every 1 minute
        this.sendReserveToShafadoc();

        setInterval(_ => {
            console.log('run clear table list');
            todayReserves.clearSentRows()
                .then(_ => {
                    console.log('cleared today finished reserves')
                });
            futureReserves.clearSentRows()
                .then(_ => {
                    console.log('cleared future finished reserves')
                });

        },  1000 * 60 * 60 * 24 ); // every 1 month

        const signalr = new signalR();
        signalr.then(_ => {
            this.setState({splashScreen: false});
        }).catch(_ => {
            // this.setState({splashScreen: true});
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        window.setting = this.props.setting;
    }


    render() {
        const {state, props} = this;

        return <React.Fragment>
            {props.base.loading ? <div className={'Loading-background'}>
                <div className="Loading-prompt">
                    <img src={Resource.IMAGE.LOADER.BLACK} alt={''}/>
                    <p>لطفا منتظر بمانید ...</p>
                </div>
            </div> : null}
            <Switch>
                {/*warn اگر روت جدید به پایین اضاف می شه به این روت اصلی هم اضافه کن*/}
                <Route exact path={[Resource.Route.HOME, Resource.Route.DARMANGAH, Resource.Route.SPECIALITIES, Resource.Route.DOCTORS, Resource.Route.CALENDAR, Resource.Route.DOCTOR_TIME, Resource.Route.RESERVE_FINALIZATION, Resource.Route.TELL_FINALIZATION, Resource.Route.SETTING, Resource.Route.TEST]}>
                    {state.splashScreen ? <Splashscreen logo={Resource.IMAGE.Splash} title={'در حال اتصال به سرور'} onMultipleClick={_ => this.setState({splashScreen: false})}/> :
                        <div className={'Layout'}>
                            <Route path={Resource.Route.HOME} exact component={PageMain}/>
                            <Route path={Resource.Route.DARMANGAH} exact component={PageDarmangah}/>
                            <Route path={Resource.Route.SPECIALITIES} exact component={PageSpecialities}/>
                            <Route path={Resource.Route.DOCTORS} exact component={PageDoctors}/>
                            <Route path={Resource.Route.RESERVE_FINALIZATION} exact component={PageReserveFinalization}/>
                            <Route path={Resource.Route.TELL_FINALIZATION} exact component={PageTellFinalization}/>
                            <Route path={Resource.Route.SETTING} exact component={PageSetting}/>
                            <Route path={Resource.Route.DOCTOR_TIME} exact component={PageDoctorTime}/>
                            <Route path={Resource.Route.CALENDAR} exact component={PageCalendar}/>
                            <Route path={Resource.Route.TEST} exact component={PageTest}/>
                        </div>}
                </Route>
                <Route exact path={[Resource.Print.RECEIPT]}>
                    <div className={'Print'}>
                        <Route path={Resource.Print.RECEIPT} exact component={ReportReceipt}/>
                    </div>
                </Route>
                <Route path={Resource.Route.QUEUE} exact component={PageQueue}/>
            </Switch>
        </React.Fragment>;
    }

    backToMainMenu() {
        const {props} = this;

        props.resetUserDataEntry();
        props.history.push(Resource.Route.HOME);
    }

    sendReserveToShafadoc() {
        const {props} = this;
        const {setting} = props;
        if (setting.shafadocDomain)
            todayReserves.list()
                .then(list => {
                    list = list.sort((a, b) => a.send_at - b.send_at);

                    if (list && list.length) {
                        const {setting} = this.props;
                        const appointment = list.shift();

                        if (moment().unix() - appointment.send_at < 60)
                            return;

                        this.setState({sending: true});

                        console.log(moment(appointment.ofTime, "HH:mm:ss").format());
                        console.log(this.state.edgeShift, this.state.edgeShift.edge);
                        console.log(moment(this.state.edgeShift.edge, 'HH:mm').format());
                        const checker = moment(appointment.ofTime, "HH:mm:ss").isAfter(moment(this.state.edgeShift.edge, 'HH:mm'));
                        console.log(checker);
                        if (this.state.edgeShift.edge && checker) {
                            appointment.specialtySlug = this.state.edgeShift?.[appointment.specialtySlug] || appointment.specialtySlug
                        }

                        Main.sendReserveToShafadoc({
                            shafaDocUrl: setting.shafadocDomain,
                            nodeId: appointment.nodeId,
                            docID: appointment.docId,
                            docCode: appointment.docCode,
                            Of_time: appointment.ofTime,
                            patientCodeMelli: appointment.patientCodeMelli,
                            turnNo: appointment.turnNo,
                            paymentAmount: appointment.paymentAmount,
                            transactionID: appointment.transactionId,
                            firstName: appointment.firstName,
                            lastName: appointment.lastName,
                            fatherFirstName: appointment.fatherFirstName,
                            birthDate: appointment.birthDate,
                            specialtySlug: appointment.specialtySlug,
                            gender: appointment.gender,
                            mobileNumber: appointment.mobileNumber,
                            insurId: appointment.insureId?.toString(),
                            insurNumber: appointment.insureNumber?.toString()
                        })
                            .then(data => {
                                this.setState({sending: false});

                                if (data?.status == 200 && parseInt(data?.result))
                                    todayReserves.update(appointment.id, {finished: 'true', response: data, send_at: moment().format()})
                                        .then(_ => {
                                            this.sendReserveToShafadoc();
                                        });
                                else
                                    todayReserves.update(appointment.id, {finished: 'false', response: data, send_at: moment().unix()})
                                        .then(_ => {
                                            this.sendReserveToShafadoc();
                                        });
                            })
                            .catch(message => {
                                todayReserves.update(appointment.id, {finished: 'false', response: message, send_at: moment().unix()})
                                    .then(_ => {
                                        this.sendReserveToShafadoc();
                                    });
                            });
                    }
                })
                .catch(message => {
                    console.log(message);
                });

        futureReserves.list()
            .then(list => {
                list = list.sort((a, b) => a.send_at - b.send_at);

                if (list && list.length) {
                    const appointment = list.shift();

                    api.getToken().then(token => {
                        api.reserve({...appointment, token}).then(data => {
                            if (data?.resid) {
                                futureReserves.update(appointment.id, {
                                    finished: 'true',
                                    turnNo: data.turnNo,
                                    response: data,
                                    send_at: moment().format()
                                });
                                props.updateBase({unreserved: {}});
                            }
                        }).catch(err => {
                            futureReserves.update(appointment.id, {
                                finished: 'false',
                                response: err,
                                send_at: moment().unix()
                            });

                            console.log(err);
                        });
                    }).catch(err => {
                        futureReserves.update(appointment.id, {
                            finished: 'false',
                            response: err,
                            send_at: moment().unix()
                        });

                        console.log(err);
                    });
                }
            })
            .catch(message => {
                console.log(message);
            });
    }
}

const mapStateToProps = state => {
    return {
        setting: state.setting,
        base: state.base
    };
};

const mapDispatchToProps = dispatch => {
    return {
        resetUserDataEntry: _ => dispatch(resetUserDataEntry()),
        updateBase: props => dispatch(updateBase(props))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));

