import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import Layout from './Layout';
import './Resource/Stylesheets/reset.css';
import './Resource/Stylesheets/config.css';
import './Resource/Stylesheets/fontiran.css';
import './Resource/Stylesheets/responsive.css';
import {Provider} from 'react-redux';
import store from './Redux/store';
import {HashRouter} from 'react-router-dom';

ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <Layout/>
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
