import MyComponent from '../../../Components/MyComponent';
import React from 'react';
import Page from '../../../Components/Page';
import Resource from '../../../Resource';
import './index.css';
import Button from '../../../Components/Button';
import {connect} from 'react-redux';
import SpecialityCard from '../../SpecialityCard';
import {updateBase, updateUserDataEntry} from '../../../Redux/Actions/base';
import BackToMainMenu from "../../../backToMainMenu";
import Signalr from "../../../signalr";


class PageSpecialities extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        BackToMainMenu.setTimer(this);
    }

    componentWillUnmount() {
        BackToMainMenu.clearTimer();
    }

    render() {
        const {state, props} = this;
        const {userDataEntry} = props.base;

        return <Page className={'PageSpecialities dis-f'} id={'PageSpecialities'}>
            <div className={'main fb-20'} style={{maxHeight: 'calc(100vh - 150px)', overflow: 'auto'}}
                 onClick={_ => BackToMainMenu.resetTimer()}>
                {userDataEntry.darmangah === "MORNING" ? props.base.morningSpecialities?.map((item, index) => <div
                    className={'fb-10 fb-5x-20 pad-8'}><SpecialityCard key={index} data={item}
                                                                       onClick={this.cardClickHandler.bind(this)}/>
                </div>) : null}
                {userDataEntry.darmangah === "EVENING" ? props.base.eveningSpecialities?.map((item, index) => <div
                    className={'fb-10 fb-5x-20 pad-8'}><SpecialityCard key={index} data={item}
                                                                       onClick={this.cardClickHandler.bind(this)}/>
                </div>) : null}
                {userDataEntry.darmangah === "FUTURE" ? props.base.futureSpecialities?.map((item, index) => <div
                    className={'fb-10 fb-5x-20 pad-8'}><SpecialityCard key={index} data={item}
                                                                       onClick={this.cardClickHandler.bind(this)}/>
                </div>) : null}
            </div>
            <div className="dis-f fb-20 mar-t-20">
                <div className="flex"/>
                <Button title={`بازگشت ${state.timer}`} theme={'red'} onClick={this.backClickHandler.bind(this)}/>
            </div>
        </Page>;
    }

    backClickHandler() {
        const {props} = this;

        props.history.push(Resource.Route.DARMANGAH);
    }

    cardClickHandler(data) {
        const {props} = this;


        props.updateUserDataEntry({speciality: data});

        
        props.updateBase({tax_id: data.Id});
        props.history.push(Resource.Route.DOCTORS);
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

export default connect(mapStateToProps, mapDispatchToProps)(PageSpecialities);