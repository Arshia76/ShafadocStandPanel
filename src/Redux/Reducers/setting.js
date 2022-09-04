/* eslint eqeqeq: off */
import App from "../../App";
import {UPDATE_SETTING} from "../Actions/setting";

const savedState = App.storage.get('redux')?.setting || {};

const initialState = {
    debugMood: false,
    disableJari:false,
    chargeAmount:false,
    showChargeAmountReciept:false,
    chargeAmountReserve:false,
    foreigenerCode:null,
    foreigenerCodeAzad:null,
    reservePrice:false,
    disableFuture:false,
    disableServices:false,
    disableReciept:false,
    getPsychiatristVisitTime:false,
    serverDomain: null,
    shafadocDomain: null,
    resultPath: null,
    personPath: null,
    insuranceMapPath: null,
    reportLayoutPath: null,
    report2LayoutPath:null,
    posServerIp: null,
    foreignClientPrevent: '',
    shafadocPorsantPrompt:'',
    nationalCodeUsageLimit: null,
    kioskNumber: null,
    psychiatristId:null,
    nodeId: null,
    nationalCodeValidationCheck: false,
    backToMainMenuButton: false,
    multiAccountPayment: false,
    generateHID: false,
    samadCodeInquiry: false,
    patientMobile: false,
    backToMainMenuDuration: null,
    receiptPrint: {
        margin: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        },
        duration: 1,
        format: '1',
        description: '',
        hospitalName: ''
    },
    ...savedState
};

const reducer = (state = initialState, action) => {
    let newState = {...state};

    switch (action.type) {
        case UPDATE_SETTING:
            delete action.type;
            newState = {
                ...state,
                ...action
            };
            break;
        default:
            return newState;
    }

    App.storage.set('redux', {
        ...App.storage.get('redux', {}),
        setting: newState
    });

    return newState;
};

export default reducer;