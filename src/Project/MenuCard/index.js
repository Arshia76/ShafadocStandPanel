import React from 'react';
import MyComponent from '../../Components/MyComponent';
import './index.css';
import PropTypes from 'prop-types';
import Resource from '../../Resource';

class MenuCard extends MyComponent {
    static defaultProps = {
        title: null,
        icon: Resource.IMAGE.PACK.CHECK.BLACK,
        description: null,
        disabled: false,
        onClick: _ => null,
    };

    static propTypes = {
        title: PropTypes.string,
        icon: PropTypes.string,
        description: PropTypes.string,
        disabled: PropTypes.bool,
        onClick: PropTypes.func,
    };

    render () {
        const {props} = this;
        return <div className={`MenuCard ${props.disabled ? 'disabled' : ''}`} onClick={this.onClickHandler.bind(this)}>
            <h1 style={{backgroundImage: `url(${props.icon})`}}>{props.title}</h1>
            <p>{props.description}</p>
        </div>;
    }

    onClickHandler () {
        const {props} = this;

        if (!props.disabled)
            props.onClick();
    }
}

export default MenuCard;