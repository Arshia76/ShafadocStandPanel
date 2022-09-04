import React from 'react';
import MyComponent from '../../Components/MyComponent';
import './index.css';
import PropTypes from 'prop-types';

class SpecialityCard extends MyComponent {
    static defaultProps = {
        data: {},
        disabled: false,
        onClick: _ => null,
    };

    static propTypes = {
        data: PropTypes.object,
        disabled: PropTypes.bool,
        onClick: PropTypes.func,
    };

    render() {
        const {props} = this;

        return <div className={`SpecialityCard ${props.disabled ? 'disabled' : ''}`} onClick={this.onClickHandler.bind(this)}>
            {props.data?.icon && <img src={props.data?.icon} alt=""/>}
            <h1>{props.data?.title}</h1>
        </div>;
    }

    onClickHandler() {
        const {props} = this;

        if (!props.disabled)
            props.onClick(props.data);
    }
}

export default SpecialityCard;