import {Component} from 'react';
import {default as lodash} from 'lodash';

class MyComponent extends Component {
    componentDidMount() {
        this.mounted = true;
        this.unmounted = false;
    }

    componentWillUnmount() {
        this.mounted = false;
        this.unmounted = true;
    }

    setField(key, value) {
        // if (window.env.DEBUG_MOOD)
        console.log('%csetField', 'color:rgb(46, 125, 164)', key, value);

        const keys = key?.split('.') || [];
        const fields = {...(this.state?.fields || {})};

        lodash.set(fields, key, value);

        this.fieldWillUpdate(keys, value, this.state.fields, fields);

        this.setState({fields});

        return {key, value, keys, fields};
    }

    fieldWillUpdate(keys, value, currentFields, nextFields) {
    }
}

export default MyComponent;