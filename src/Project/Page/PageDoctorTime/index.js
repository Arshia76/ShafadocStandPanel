import React from 'react';
import MyComponent from "../../../Components/MyComponent";
import Page from '../../../Components/Page'
import './index.css';
import Button from '../../../Components/Button'
import Resource from "../../../Resource";
import BackToMainMenu from "../../../backToMainMenu";
import {connect} from "react-redux";
import moment from "jalali-moment";
import {updateBase, updateUserDataEntry} from "../../../Redux/Actions/base";
import {api} from "../../../api";
import Notif from "../../../Components/Notif";

class PageDoctorTime extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            times: []
        }
    }

    componentDidMount() {
        const {props} = this;
        const {setting} = props;
        const {userDataEntry} = props.base;

        BackToMainMenu.setTimer(this);

        props.updateBase({loading: true});

        api.getFt({NodeId: setting.nodeId, DocId: userDataEntry.doctor.id, date: moment(userDataEntry.reserveDate).format('YYYY-MM-DDT00:00:00')})
            .then(fts => {
                props.updateBase({loading: false});
                const filteredFts = fts.filter(data => data.ft_capacity > 0)
                this.setState({
                    times: filteredFts.map(item => ({
                        docId: item.doc_id,
                        tqId: item.ft_TQID,
                        capacity: item.ft_capacity,
                        date: item.ft_date,
                        description: item.ft_description,
                        time: item.ft_of_time,
                        status: item.ft_status,
                        toTime: item.ft_to_time,
                        type: item.ft_type,
                        id: item.id,
                        nodeId: item.node_id
                    }))
                });
            })
            .catch(err => {
                console.log(err);
                props.updateBase({loading: false});

                new Notif({message: 'خطا در دریافت زمان‌های پزشک', theme: 'error'}).show();

                this.props.history.push(Resource.Route.HOME);
            });
    }

    componentWillUnmount() {
        BackToMainMenu.clearTimer();
    }

    render() {
        const {props, state} = this;
        const {userDataEntry} = props.base;

        return <Page className={'PageDoctorTime'} id={'PageDoctorPage'}>
            <div className={'Card'}>
                <div className={'card-top'}>
                    <div>
                        <h2>لیست وقت های رزرو دکتر {userDataEntry.doctor.name}</h2>
                        <h4>{userDataEntry.speciality.title}</h4>
                        <h6>تاریخ
                            حضور: <span>{moment(userDataEntry.reserveDate).locale('fa').format('jDD jMMMM - روز dddd')}</span>
                        </h6>
                    </div>
                    <div className={'img'}>
                        <img src={userDataEntry.doctor.avatar} alt=""/>
                    </div>
                </div>
                {state.times?.map((item, index) => <div key={index} className={'reserve-times'} onClick={this.timeClickHandler.bind(this, item)}>
                    <div>
                        {/*<img src="" alt=""/>*/}
                        <span>زمان حضور: {moment(item.time, 'HH:mm:ss').locale('fa').format('HH:mm')}</span>
                        {/*        <span style={{marginRight: '20px'}}>*/}
                        {/*    تعداد نوبت باقی مانده: {'12'}*/}
                        {/*</span>*/}
                    </div>
                    <Button theme={'green'} title={'انتخاب'}/>
                </div>)}
            </div>
            <div className="dis-f" style={{width: '100%'}}>
                <div className="flex"/>
                <Button title={`بازگشت ${this.state.timer}`} theme={'red'}
                        onClick={this.backClickHandler.bind(this)}/>
            </div>
        </Page>;
    }

    backClickHandler() {
        const {props} = this;
        props.history.push(Resource.Route.CALENDAR);
    };

    timeClickHandler(data) {
        const {props} = this;

        props.updateUserDataEntry({reserveTime: data});

        props.history.push(Resource.Route.RESERVE_FINALIZATION);
    }
}

const mapStateToProps = state => {
    return {
        base: state.base,
        setting: state.setting,
        userDataEntry: state.base.userDataEntry,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateBase: props => dispatch(updateBase(props)),
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageDoctorTime)