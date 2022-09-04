/* eslint eqeqeq: off */
import App from "../../App";
import {ADD_NATIONAL_CODE, UPDATE_BASE, UPDATE_USER_DATA_ENTRY} from "../Actions/base";
import moment from 'jalali-moment';

const savedState = App.storage.get('redux')?.base || {};

const initialState = {
    nationalCodes: [], // {code:1361399198, count:1}
    nationalCodeListDate: null,
    morningSpecialities: [],
    eveningSpecialities: [],
    futureSpecialities: [],
    doctors: [],
    insurances: [],
    filteredSpecialties:null,
    unreserved: {},
    userDataEntry: {
        specialClinic:false,
        reciept: null,
        darmangah: null, // MORNING, EVENING, FUTURE
        nationalCode: null,
        insurance:null,
        nationality: null, // IRANIAN, FOREIGN
        speciality: null,
        firstTimePsychiatristVisit:null,
        doctor: {
            id:null,
            code:null,
            firstName:null,
            lastName:null,
            name:null,
            startTime:null,
            avatar:null,
            type:null,
            description:null,
            resCount:null,
            spName:null,
            spId:null,
            spSlug:null,
            tId:null
        },
        reserveDate: null,
        reserveTime: {
            docId: null,
            tqId: null,
            capacity: null,
            date: null,
            description: null,
            time: null,
            status: null,
            toTime: null,
            type: null,
            id: null,
            nodeId: null
        },
        hasForeignInsurance: null, // Boolean
        standardInsurance: {
            id: null,
            name: null,
            boxId: null,
            boxName: null,
            number: null,
            expire: null,
            inquiryId: null
        },
        shafadocInsurance: {
            id: null,
            name: null,
            number: null,
            insurer: null
        },
        paymentData: {
            priceAmount: null,
            chargeAmount: null,
            chargePin: null,
            pricePin: null
        },
        mobile: null,
        firstName: null,
        lastName: null,
        fatherName: null,
        birthDate: null,
        gender: null, // MALE, FEMALE
        samadCode: null,
        token: null,
        hid: null,
        transactionId: null,
        resCount:null,
        turnNo:null,
        startDailyResNo: null,
        localDailyResNo: null
    },
    ...savedState,
    loading: false
};

const reducer = (state = initialState, action) => {
    let newState = {...state};

    switch (action.type) {
        case UPDATE_BASE:
            delete action.type;
            newState = {
                ...state,
                ...action
            };
            break;
        case ADD_NATIONAL_CODE:
            if (newState.nationalCodeListDate && moment(newState.nationalCodeListDate, 'jYYYY-jMM-jDD').diff(moment(), 'days') !== 0) {
                newState.nationalCodes = [];
            }
            newState.nationalCodeListDate = moment().format('jYYYY-jMM-jDD');

            const nationalCode = newState.nationalCodes.find(item => {
                return item.code == action.nationalCode;
            });
            if (nationalCode) {
                nationalCode.count = nationalCode.count + 1;
            } else {
                newState.nationalCodes.push({code: action.nationalCode, count: 1});
            }
            break;
        case UPDATE_USER_DATA_ENTRY:
            delete action.type;
            newState.userDataEntry = {
                ...state.userDataEntry,
                ...action
            };
            break;
        default:
            return newState;
    }

    App.storage.set('redux', {
        ...App.storage.get('redux', {}),
        base: newState
    });

    return newState;
};

export default reducer;