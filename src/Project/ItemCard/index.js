import React from 'react';
import MyComponent from '../../Components/MyComponent';
import PropTypes from 'prop-types';
import './index.css';

class ItemCard extends MyComponent {
    static defaultProps = {
        data: 0,
        title: '',
        desc: '',
        selected: false,
        onClick: _ => null
    };

    static propTypes = {
        data: PropTypes.any,
        title: PropTypes.string,
        desc: PropTypes.string,
        selected: PropTypes.bool,
        onClick: PropTypes.func
    };

    render () {
        return <div className={`ItemCard ${this.props.selected ? 'selected' : ''}`} onClick={this.clickEvent.bind(this)}>
            <div>{this.props.title}</div>
            {this.props.desc && <span>{this.props.desc}</span>}
        </div>;
    }

    clickEvent () {
        this.props.onClick(this.props.data);
    }
}

export default ItemCard;