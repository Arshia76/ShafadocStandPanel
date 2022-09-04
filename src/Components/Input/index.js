import React, {Component} from "react";
import {Var} from "../../App";
import PropTypes from "prop-types";
import './index.css';

class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled: false,
            readOnly: false,
            error: null,
            value: props.value,
            id: `inp_${Var.shuffle('string', 6)}`
        };

        this.ref = {
            input: React.createRef()
        };
    }

    static defaultProps = {
        className: null,
        style: {},
        align: 'right',
        direction: 'rtl',
        label: null,
        placeholder: null,
        mask: null,
        id: null,
        name: null,
        readOnly: false,
        disabled: false,
        value: '',
        length: null,
        type: 'text',
        onEnter: _ => null,
        onKeyUp: _ => null,
        onChange: _ => null,
        onClick: _ => null,
        onDoubleClick: _ => null,
        onFocus: _ => null,
        onBlur: _ => null,
        validation: _ => true
    };
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        align: PropTypes.oneOf(['left', 'center', 'right']),
        direction: PropTypes.oneOf(['ltr', 'rtl']),
        label: PropTypes.string,
        placeholder: PropTypes.string,
        mask: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        readOnly: PropTypes.bool,
        disabled: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        length: PropTypes.number,
        type: PropTypes.oneOf(['text', 'number', 'password']),
        onEnter: PropTypes.func,
        onChange: PropTypes.func,
        onClick: PropTypes.func,
        onDoubleClick: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        validation: PropTypes.func,
        onKeyUp: PropTypes.func
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.props.value !== nextProps.value)
            nextState.value = nextProps.value;

        return this.state.disabled !== nextState.disabled ||
            this.state.readOnly !== nextState.readOnly ||
            this.state.error !== nextState.error ||
            this.state.value !== nextState.value ||
            this.props.readOnly !== nextProps.readOnly ||
            this.props.disabled !== nextProps.disabled ||
            this.props.className !== nextProps.className ||
            this.props.style !== nextProps.style ||
            this.props.value !== nextProps.value;
    }

    render() {
        const {state, props} = this;
        const cls = ['Input', props.align];
        const readOnly = state.readOnly || props.readOnly;
        const disabled = state.disabled || props.disabled;
        const id = props.id || state.id;
        const vm = props.mask ? this.renderMask() : (state.value || '');
        let label = null;

        !readOnly && !disabled && state.error && cls.push('error');

        props.className && cls.push(props.className);
        readOnly && cls.push('read-only');
        disabled && cls.push('disabled');
        props.label && (label = <label className={'Input-label'} htmlFor={id}>{props.label}</label>);

        return <div className={cls.join(' ')} style={props.style}>
            {label}
            <input ref={this.ref.input}
                   type={props.type}
                   className={'Input-control'}
                   id={id}
                   name={props.name || id}
                   placeholder={props.placeholder}
                   title={props.placeholder}
                   value={vm}
                   readOnly={readOnly}
                   disabled={disabled}
                   maxLength={props.length}
                   autoComplete="off"
                   onKeyUp={this.inputKeyDownHandler.bind(this)}
                   onFocus={props.onFocus}
                   onBlur={this.inputBlurHandler.bind(this)}
                   onChange={this.inputChangeHandler.bind(this)}
                   onClick={props.onClick}
                   onDoubleClick={props.onDoubleClick}
                   style={{direction: props.direction}}/>
            {state.error && <p className={'Input-error'}>{state.error}</p>}
        </div>;
    };

    renderMask() {
        // debugger
        const value = this.state.value.toString().slice(0,8);
        const mask = this.props.mask; // --/--/----  /^\d{2}\/\d{2}\/\d{4}$/
        let vm = mask;

        if (!mask)
            return value;

        for (let i = 0; i < value.length; i++)
            vm = vm.replace('#', value[i]);

        vm = vm.replaceAll('#', '_');

        return vm;

        // for (let i = 0; i < mask.length; i++) {
        //    if(mask[i] !== '/') {
        //        mask[i].replace(mask,value);
        //    }
        // }
        // if (value.match(/^\d{2}$/) !== null) {
        //     value = value + '/';
        // } else if (value.match(/^\d{2}\/\d{2}$/) !== null) {
        //     value = value + '/';
        // }

    }

    disabled(disabled = false) {
        this.setState({disabled});
    }

    error(prompt = null) {
        this.setState({error: prompt});
    }

    focus() {
        this.ref.input.current.focus();
    }

    inputBlurHandler(event) {
        const {state, props} = this;

        this.validate();

        props.onBlur(state.value, event);
    };

    inputChangeHandler(event) {
        const {props, state} = this;
        let value = event.target.value;

        if (!props.mask)
            this.setState({value}, _ => {
                this.validate();
                props.onChange(value);
            });
    };

    inputKeyDownHandler(event) {
        const {state, props} = this;
        if (props.mask) {
            // if (event.keyCode >= 49 && event.keyCode <= 57) {
                this.setState({
                    value: state.value + (event.key || '')
                });
            // }

            if (event.keyCode === 8) {
                this.setState({
                    value: state.value.substr(0, state.value.length - 1)
                });
            }
        }
    }

    readOnly(readOnly = false) {
        this.setState({readOnly});
    }

    value() {
        const {state} = this;

        return state.value ? state.value : '';
    }

    validate(value = this.state.value) {
        const {props} = this;
        const validate = props.validation(value);

        if (validate === true)
            this.error();
        else
            this.error(validate);

        return validate === true ? true : {
            label: props.label || props.placeholder || '',
            message: validate
        };
    }
}

export default Input;