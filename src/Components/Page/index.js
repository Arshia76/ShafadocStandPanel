import React from 'react';
import './index.css';
import PropTypes from 'prop-types';
import MyComponent from '../MyComponent';

class Page extends MyComponent {
    constructor (props) {
        super(props);

        this.state = {};
    }

    static defaultProps = {
        className: null,
        id: null,
        style: {},
    };

    static propTypes = {
        className: PropTypes.string,
        id: PropTypes.string,
        style: PropTypes.object
    };

    shouldComponentUpdate (nextProps, nextState, nextContext) {
        return this.props.children !== nextProps.children;
    }

    render () {
        const classes = ['Page', this.props.className];

        return <div ref="page" className={classes.join(' ')} id={this.props.id} style={this.props.style}>
            {this.props.children}
        </div>;
    }
}

export default Page;