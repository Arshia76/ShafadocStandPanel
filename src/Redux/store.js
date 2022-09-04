import {compose, createStore} from "redux";
import reducer from './reducer';

// FOR DEVELOP PURPOSE
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = window.ENV.DEBUG_MOOD ? createStore(reducer, composeEnhancers()) : createStore(reducer);
const store = createStore(reducer, composeEnhancers());

export default store;