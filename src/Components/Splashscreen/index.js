import React from 'react'
import MyComponent from "../MyComponent";
import Resource from "../../Resource";
import './index.css'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import App from "../../App";

class Splashscreen extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            goToSettingTapCount: 0
        };
    }

    static defaultProps = {
        title: '',
        logo: Resource.IMAGE.LOADER.BLACK,
        onMultipleClick:_=>null
    };
    static propTypes = {
        title: PropTypes.string,
        logo: PropTypes.string,
        onMultipleClick:PropTypes.func
    };

    render() {
        const {props} = this;
        return <div className={'Splashscreen'} onClick={this.clickHandler.bind(this)}>
            <img src={props.logo} alt={''}/>
            <h3>{props.title}</h3>
        </div>;
    }

    clickHandler() {
        const {props, state} = this;
        const {goToSettingTapCount} = state;

        if (goToSettingTapCount > 10) {
            this.setState({goToSettingTapCount: 0});

            props.onMultipleClick();
            props.history.push(Resource.Route.SETTING);
        }

        this.setState({goToSettingTapCount: goToSettingTapCount + 1}, _ => {
            App.setUniqueTimeout(_ => {
                this.setState({goToSettingTapCount: 0});
            }, 1000);
        });

    }
}

export default withRouter(Splashscreen)