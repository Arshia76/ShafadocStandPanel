import {combineReducers} from "redux";
import baseReducer from './Reducers/base';
import settingReducer from './Reducers/setting';

const reducer = combineReducers({
    base: baseReducer,
    setting: settingReducer
});

export default reducer;
