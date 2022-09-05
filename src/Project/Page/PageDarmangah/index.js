import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import Page from '../../../Components/Page';
import Resource from '../../../Resource';
import './index.css';
import Button from '../../../Components/Button';
import MenuCard from '../../MenuCard';
import signalR from '../../../signalr';
import {connect} from 'react-redux';
import {updateBase, updateUserDataEntry} from '../../../Redux/Actions/base';
import BackToMainMenu from "../../../backToMainMenu";
import {api} from "../../../api";
import {futureReserves} from "../../../db";

class PageDarmangah extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            morningLoading: true,
            eveningLoading: true,
            futureLoading: true,
            morningDisabled: true,
            eveningDisabled: true,
            futureDisabled: true,
            morningSpecialities: [],
            eveningSpecialities: [],
            morningText: 'دریافت نوبت از درمانگاه (شیفت صبح)',
            eveningText: 'دریافت نوبت از درمانگاه (شیفت عصر)',
        };
    }

    componentDidMount() {
        const {props} = this;

        BackToMainMenu.setTimer(this);

        signalR.setSpesFirst = (specialities, flag, startTime) => {
            this.setState({morningLoading: false});

            specialities = specialities.map(item => ({
                id: item.Id,
                icon: `data:image/png;base64,${item.Image}`,
                title: item.Name
            }));

            if (!specialities || specialities.length === 0) {
                if (flag === 0) {
                    this.setState({morningText: 'زمان درمانگاه صبح به اتمام رسیده است.'});
                } else if (flag === -1) {
                    this.setState({morningText: `نوبت‌دهی برای درمانگاه صبح از ساعت ${startTime} شروع خواهد شد.`});
                } else {
                    this.setState({morningText: 'نوبت‌های درمانگاه صبح تمام شده است.'});
                }
            } else {
                if (flag === 0) {
                    this.setState({morningText: 'زمان درمانگاه صبح به اتمام رسیده است.'});
                } else if (flag === -1) {
                    this.setState({morningText: 'تا چند لحظه‌ی دیگر نوبت‌دهی برای درمانگاه صبح شروع خواهد شد.'});
                } else {
                    this.setState({
                        morningDisabled: false
                    });

                    props.updateBase({morningSpecialities: specialities});
                }
            }
        };
        signalR.setSpesSecond = (specialities, flag, startTime) => {
            this.setState({eveningLoading: false});

            specialities = specialities.map(item => ({
                id: item.Id,
                icon: `data:image/png;base64,${item.Image}`,
                title: item.Name
            }));

            if (!specialities || specialities.length === 0) {
                if (flag === 0) {
                    this.setState({eveningText: 'زمان درمانگاه عصر به اتمام رسیده است.'});
                } else if (flag === -1) {
                    this.setState({eveningText: `نوبت‌دهی برای درمانگاه عصر از ساعت ${startTime} شروع خواهد شد.`});
                } else {
                    this.setState({eveningText: 'نوبت‌های درمانگاه عصر تمام شده است.'});
                }
            } else {
                if (flag === 0) {
                    this.setState({eveningText: 'زمان درمانگاه عصر به اتمام رسیده است.'});
                } else if (flag === -1) {
                    this.setState({eveningText: 'تا چند لحظه‌ی دیگر نوبت‌دهی برای درمانگاه عصر شروع خواهد شد.'});
                } else {
                    this.setState({
                        eveningDisabled: false
                    });

                    props.updateBase({eveningSpecialities: specialities});
                }
            }
        };

        signalR.getSpesFirst();
        signalR.getSpesSecond();
        this.getFutureReservationData();
    }

    componentWillUnmount() {
        BackToMainMenu.clearTimer();
    }

    render() {
        const {state} = this;
        const loading = state.morningLoading || state.eveningLoading;
        const futureDisabled = state.futureDisabled || futureReserves.list().length;
        const unreserved = Object.keys(this.props.base.unreserved).length !== 0 ;
        const {setting} = this.props;

        return <Page className={'PageDarmangah dis-f'} id={'PageDarmangah'}>
            <div className={'fb-20'} onClick={_ => BackToMainMenu.resetTimer()}>
                <MenuCard title={state.morningText} disabled={setting.disableJari || state.morningDisabled} icon={loading ? Resource.IMAGE.LOADER.BLACK : Resource.IMAGE.DAY} description={'برای دریافت نوبت صبح می توانید همین دکمه را لمس کنید.'} onClick={this.cardClickHandler.bind(this, 'MORNING')}/>
                <MenuCard title={state.eveningText} disabled={setting.disableJari || state.eveningDisabled} icon={loading ? Resource.IMAGE.LOADER.BLACK : Resource.IMAGE.NIGHT} description={'برای دریافت نوبت ظهر می توانید همین دکمه را لمس کنید.'} onClick={this.cardClickHandler.bind(this, 'EVENING')}/>
                <MenuCard title={'نوبت روزهای آینده '} disabled={unreserved || setting.disableFuture || futureDisabled} icon={state.futureLoading ? Resource.IMAGE.LOADER.BLACK : Resource.IMAGE.CIRCLE["1"]} description={'جهت دریافت نوبت روزهای آینده لمس کنید.'} onClick={this.cardClickHandler.bind(this, 'FUTURE')}/>
                <div className="dis-f mar-t-10">
                    <div className="flex"/>
                    <Button title={`بازگشت ${state.timer}`} theme={'red'} onClick={this.backClickHandler.bind(this)}/>
                </div>
            </div>
        </Page>;
    }

    backClickHandler() {
        const {props} = this;

        props.history.push(Resource.Route.HOME);
    }

    cardClickHandler(type) {
        const {props} = this;

        props.updateUserDataEntry({
            darmangah: type
        });

        props.history.push(Resource.Route.SPECIALITIES);
    }

    getFutureReservationData() {
        const {props} = this;
        this.setState({futureLoading: true});

        api.getList({nodeId: props.setting.nodeId})
            .then(result => {
                this.setState({futureLoading: false, futureDisabled: false});

                props.updateBase({
                    futureSpecialities: result.specialities,
                    doctors: result.doctors
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({futureLoading: false, futureDisabled: true});
                props.updateBase({futureSpecialities: [], doctors: [], loading: false});
            });
    }
}

const mapStateToProps = state => {
    return {
        base: state.base,
        setting: state.setting
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateBase: props => dispatch(updateBase(props)),
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageDarmangah);