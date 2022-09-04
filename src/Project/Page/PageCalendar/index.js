import React from 'react';
import Page from '../../../Components/Page';
import MyComponent from "../../../Components/MyComponent";
import Calendar from "../../Calendar";
import './index.css'
import Button from "../../../Components/Button";
import Resource from "../../../Resource";
import BackToMainMenu from "../../../backToMainMenu";
import {connect} from 'react-redux'
import {updateUserDataEntry} from "../../../Redux/Actions/base";


class PageCalendar extends MyComponent {
    constructor(props) {
        super(props);

        this.state={};
    }

    componentDidMount() {
        BackToMainMenu.setTimer(this);
    }

    componentWillUnmount() {
        BackToMainMenu.clearTimer();
    }

    render() {
        return <Page className={'PageCalendar'} id={'PageCalendar'}>
            <Calendar/>
            <div className="dis-f" style={{width: '100%'}}>
                <div className="flex"/>
                <Button title={`بازگشت ${this.state.timer}`} theme={'red'} onClick={this.backClickHandler.bind(this)}/>
            </div>
        </Page>;
    }

    backClickHandler() {
        const {props} = this;
        props.history.push(Resource.Route.DOCTORS);
    }
}

const mapStateToProps = (state) => {
    return {
        base: state.base
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateUserDataEntry: props => dispatch(updateUserDataEntry(props))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageCalendar);