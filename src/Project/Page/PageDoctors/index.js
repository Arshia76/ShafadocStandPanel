import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import Page from '../../../Components/Page';
import Resource from '../../../Resource';
import './index.css';
import Button from '../../../Components/Button';
import {connect} from 'react-redux';
import {updateBase, updateUserDataEntry} from '../../../Redux/Actions/base';
import Splashscreen from "../../../Components/Splashscreen";
import DoctorCard from "../../DoctorCard";
import BackToMainMenu from "../../../backToMainMenu";
import {api} from "../../../api";
import signalR from "../../../signalr";
import Notif from "../../../Components/Notif";

class PageDoctors extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            doctors: []
        }
    }

    componentDidMount() {
        const {props} = this;
        const {userDataEntry} = props.base;

        BackToMainMenu.setTimer(this);

        signalR.setDocOfSpFirstShift = (doctors) => {
            doctors = doctors.map(item => ({
                id: item.DocId,
                code: null,
                firstName: item.FirstName,
                lastName: item.FamilyName,
                name: `${item.FirstName} ${item.FamilyName}`,
                startTime: item.StartTime,
                avatar: `data:image/png;base64,${item.Photo}`,
                type: item.DocTypeCaption,
                description: item.Description,
                resCount: item.ResCount,
                spName: item.spName,
                spId: item.spId,
                spSlug: item.spSlug,
                tId: item.tId
            }));

            this.setState({doctors});
        };

        signalR.setDocOfSpSecondShift = (doctors) => {
            doctors = doctors.map(item => ({
                id: item.DocId,
                code: null,
                firstName: item.FirstName,
                lastName: item.FamilyName,
                name: `${item.FirstName} ${item.FamilyName}`,
                startTime: item.StartTime,
                avatar: `data:image/png;base64,${item.Photo}`,
                type: item.DocTypeCaption,
                description: item.Description,
                resCount: item.ResCount,
                spName: item.spName,
                spId: item.spId,
                spSlug: item.spSlug,
                tId: item.tId
            }));

            this.setState({doctors});
        };

        if (userDataEntry.darmangah === 'MORNING') {
            signalR.getDocOfSpFirstShift(userDataEntry.speciality.id);
        } else if (userDataEntry.darmangah === 'EVENING') {
            signalR.getDocOfSpSecondShift(userDataEntry.speciality.id);
        }
    }

    componentWillUnmount() {
        BackToMainMenu.clearTimer();
    }

    render() {
        const {state, props} = this;
        const {userDataEntry} = props.base;

        return <Page className={'PageDoctors dis-f'} id={'PageDoctors'}>
            <div className={'fb-20 dis-f'} style={{maxHeight: 'calc(100vh - 150px)', overflow: 'auto'}} onClick={_ => BackToMainMenu.resetTimer()}>
                {state.loading ?
                    <Splashscreen title={'در حال دریافت لیست پزشکان'}/> :
                    <React.Fragment>
                        {userDataEntry.darmangah === 'MORNING' || userDataEntry.darmangah === 'EVENING' ? state.doctors.map((item, index) => <div key={index} className={'fb-10 fb-5x-20 pad-8'}><DoctorCard data={item} onClick={this.cardClickHandler.bind(this)}/></div>) : null}
                        {userDataEntry.darmangah === 'FUTURE' ? props.base.doctors?.[userDataEntry?.speciality?.id].map((item, index) => <div key={index} className={'fb-10 fb-5x-20 pad-8'}><DoctorCard data={item} onClick={this.cardClickHandler.bind(this)}/></div>) : null}
                    </React.Fragment>}
            </div>
            <div className="dis-f" style={{width: '100%', marginTop: 12}}>
                <div className="flex"/>
                <Button title={`بازگشت ${state.timer}`} theme={'red'} onClick={this.backClickHandler.bind(this)}/>
            </div>
        </Page>;
    }

    backClickHandler() {
        const {props} = this;

        props.history.push(Resource.Route.SPECIALITIES);
    }

    cardClickHandler(data) {
        const {props} = this;
        const {userDataEntry} = props.base;

        props.updateUserDataEntry({doctor: data});

        if (userDataEntry.darmangah === 'MORNING' || userDataEntry.darmangah === 'EVENING') {
            props.updateUserDataEntry({loading: true});

            api.getDocInfo(data.id)
                .then(newData => {
                    props.updateUserDataEntry({
                        doctor: {
                            ...data,
                            code: newData.DocCode,
                            spId: newData.specialtyId,
                            spName: newData.specialtyName,
                            spSlug: newData.specialtySlug
                        },
                        loading: false
                    });

                    props.history.push(Resource.Route.RESERVE_FINALIZATION)
                })
                .catch(message => {
                    props.updateUserDataEntry({loading: false});

                    new Notif({message, theme: 'error'}).show();
                });
        } else if (userDataEntry.darmangah === 'FUTURE')
            props.history.push(Resource.Route.CALENDAR);
    }
}

const mapStateToProps = state => {
    return {
        base: state.base
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props)),
        updateBase: props => dispatch(updateBase(props))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageDoctors);