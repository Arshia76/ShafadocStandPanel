import MyComponent from '../MyComponent';
import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import {Var} from '../../App';
import Resource from "../../Resource";

class Button extends MyComponent {
    constructor(props) {
        super(props);

        this.state = {
            id: props.id || `button-${Var.shuffle(undefined, 6)}`,
            disabled: false,
            loading: false
        };

        this.ref = {
            button: React.createRef()
        };
    }

    static defaultProps = {
        id: null,
        className: null,
        theme: null,
        style: {},
        title: null,
        icon: null,
        disabled: false,
        onClick: _ => null
    };

    static propTypes = {
        id: PropTypes.string,
        className: PropTypes.string,
        theme: PropTypes.oneOf(['red', 'blue', 'yellow', 'green']),
        style: PropTypes.object,
        title: PropTypes.string,
        icon: PropTypes.string,
        disabled: PropTypes.bool,
        onClick: PropTypes.func
    };

    render() {
        const {props, state} = this;
        const loading = state.loading
        const disabled = state.disabled || props.disabled || loading;

        return <button className={`Button ${props.className} ${props.theme}`} id={state.id} onClick={props.onClick} disabled={disabled} style={props.style}>
            {loading && <img className={'Button-loader'} src={Resource.IMAGE.LOADER.WHITE} alt=""/>}
            {props.icon && !loading && <img style={{margin: (props.icon && props.title) && '0 5px'}} className={`Button-icon ${props.title || props.children ? 'mar-e-10' : ''}`} src={props.icon} alt=""/>}
            {(props.title || props.children) && <div className={'flex'}>{props.title || props.children}</div>}
        </button>;
    }

    loading(state = true) {
        this.setState({loading: state});
    }
}

export default Button;