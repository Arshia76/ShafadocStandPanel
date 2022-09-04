import React from 'react';
import MyComponent from '../../Components/MyComponent';
import './index.css';
import PropTypes from 'prop-types';
import {connect} from "react-redux";

class DoctorCard extends MyComponent {
    static defaultProps = {
        data: {},
        disabled: false,
        className: null,
        onClick: _ => null,
    };

    static propTypes = {
        data: PropTypes.object,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        onClick: PropTypes.func,
    };

    render() {
        const {props} = this;

        return <div className={`DoctorCard ${props.className} ${props.disabled ? 'disabled' : ''}`} onClick={this.onClickHandler.bind(this)}>
            {props.data?.avatar && <img src={props.data?.avatar} alt=""/>}
            <div>
                <h1>{props.data?.name}</h1>
                <div>
                    {props.data?.type && <span>{props.data?.type}</span>}
                    {props.data?.spName && <span>{props.data?.spName}</span>}
                </div>
            </div>
        </div>;
    }

    onClickHandler() {
        const {props} = this;

        if (!props.disabled)
            props.onClick(props.data);
    }
}

const mapStateToProps = state => {
    return {
        base: state.base
    };
};

export default connect(mapStateToProps)(DoctorCard);