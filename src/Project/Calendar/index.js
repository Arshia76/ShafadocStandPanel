import React from 'react';
import moment from 'jalali-moment';
import MyComponent from "../../Components/MyComponent"
import {withRouter} from 'react-router-dom'
import './index.css'
import Button from "../../Components/Button";
import Resource from "../../Resource";
import {updateBase, updateUserDataEntry} from "../../Redux/Actions/base";
import {connect} from "react-redux";
import {api} from "../../api";
import Notif from "../../Components/Notif";

class Calendar extends MyComponent {
    constructor(props) {
        super(props);
        this.state = {
            startOfMonth: moment().startOf('jMonth').startOf('jDay'),
            endOfMonth: moment().endOf('jMonth').endOf('jDay'),
            appointments: [],
        }
    }

    componentDidMount() {
        this.getCalendar()
    }

    render() {
        return (
            <React.Fragment>
                <div className={'Calendar'}>
                    <div className={'Top'}>
                        <h2>{this.state.startOfMonth.clone().locale('fa').format('jMMM jYYYY')}</h2>
                        {/*<Button theme={'green'} style={{marginLeft: '10px', padding: '2px 20px'}} onClick={this.getCurrentMonth.bind(this)}>نوبت تاریخ {this.state.appointments?.values()[0][0]}</Button>*/}
                        <Button theme={'green'} className={'mar-e-10'} onClick={this.getCurrentMonth.bind(this)}>ماه جاری</Button>
                        <Button onClick={this.prevMonth.bind(this)} className={'mar-e-10'} title={'قبلی'} theme={'blue'}/>
                        <Button onClick={this.nextMonth.bind(this)} title={'بعدی'} theme={'blue'}/>
                    </div>

                    <table className={'table'}>
                        <tbody>
                        <tr className={'row'}>
                            {this.renderCalender(this.state.startOfMonth, this.state.endOfMonth, this.state.appointments)}
                        </tr>
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }

    calenderItemClickHandler(data, date) {
        console.log(data, date);
        const {props} = this;

        props.updateUserDataEntry({reserveDate: date.format()});

        props.history.push(Resource.Route.DOCTOR_TIME);
    }

    getCalendar() {
        const {props, state} = this;
        const {setting} = props;
        const {userDataEntry} = props.base;
        let start = state.startOfMonth.clone();
        const appointments = {};

        if (start.isBefore(moment().startOf('jDay').add(1, "jDay"), 'jDay')) {
            console.log('first if')
            start = moment().startOf('jDay').add(1, "jDay");
        }

        if (start.isAfter(state.endOfMonth, 'jDay')) {
            console.log('second if')
            return;
        }

        props.updateBase({loading: true});

        api.getReserveDates({"nodeid": setting.nodeId, "docid": userDataEntry.doctor.id,}, start.format('YYYY-MM-DD'), state.endOfMonth.format('YYYY-MM-DD'))
            .then(list => {
                const filteredList = list.filter(data => !data.IsFull)
                props.updateBase({loading: false});

                this.setState({loading: false});

                for (const item of filteredList) {
                    const day = moment(item.start);
                    const m = day.format('jM');
                    const d = day.format('jD');

                    if (!appointments[m])
                        appointments[m] = {};

                    if (!appointments[m][d])
                        appointments[m][d] = [];

                    appointments[m][d].push(item);
                }
                this.setState({appointments});
            })
            .catch(err => {
                props.updateBase({loading: false});
                console.log(err);
                new Notif({
                    message: 'خطا در دریافت روز پزشکان',
                    theme: 'error'
                }).show();
                this.props.history.push(Resource.Route.HOME)
            });
    }

    getCurrentMonth() {
        this.setState({
            startOfMonth: moment().startOf('jMonth').startOf('jDay'),
            endOfMonth: moment().endOf('jMonth').endOf('jDay')
        }, () => {
            this.getCalendar();
        });
    }

    nextMonth() {
        this.setState({
            startOfMonth: this.state.startOfMonth.clone().add(1, 'jMonth').startOf('jMonth'),
            endOfMonth: this.state.endOfMonth.clone().add(1, 'jMonth').endOf('jMonth'),
        }, () => {

            this.getCalendar()
        })

    }

    prevMonth() {
        this.setState({
            startOfMonth: this.state.startOfMonth.clone().subtract(1, 'jMonth').startOf('jMonth'),
            endOfMonth: this.state.endOfMonth.clone().subtract(1, 'jMonth').endOf('jMonth'),
        }, () => {
            this.getCalendar();
        });
    }

    renderCalender(monthStart, monthEnd, appointments) {
        const jsx = [];
        const startOfWeek = {6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6}[monthStart.format('d')];
        const endOfWeek = {6: 0, 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6}[monthEnd.format('d')];
        let day = monthStart.clone();

        console.log(startOfWeek);
        console.log(monthStart.format());
        console.log(monthEnd.format());
        console.log(appointments);
        console.log(Object.values(appointments))
        console.log(Object.values(appointments)[0])


        jsx.push(<td className={'Calender-week-name'}>شنبه</td>);
        jsx.push(<td className={'Calender-week-name'}>یکشنبه</td>);
        jsx.push(<td className={'Calender-week-name'}>دوشنبه</td>);
        jsx.push(<td className={'Calender-week-name'}>سه شنبه</td>);
        jsx.push(<td className={'Calender-week-name'}>چهارشنبه</td>);
        jsx.push(<td className={'Calender-week-name'}>پنجشنبه</td>);
        jsx.push(<td className={'Calender-week-name'}>جمعه</td>);

        for (let i = 0; i < startOfWeek; i++)
            jsx.push(<td className={'Calender-Item disabled'}/>)

        while (day.isSameOrBefore(monthEnd, 'jDay')) {
            const appointment = this.state.appointments?.[day.format('jM')]?.[day.format('jD')];
            const filled = appointment?.every(item => item.IsFull);
            jsx.push(<td className={`Calender-Item ${appointment ? 'reserved' : filled ? 'filled' : day.isBefore(moment(), 'jDay') ? 'disabled' : null}`} onClick={appointment ? this.calenderItemClickHandler.bind(this, appointment, day.clone()) : _ => null}>{day.format('jDD')}</td>)
            day.add(1, 'jDay');
        }

        for (let i = endOfWeek; i < 6; i++)
            jsx.push(<td className={'Calender-Item disabled'}/>)


        return jsx;
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
        updateBase: props => dispatch(updateBase(props)),
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Calendar));