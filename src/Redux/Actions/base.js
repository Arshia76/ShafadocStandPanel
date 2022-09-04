export const UPDATE_BASE = 'UPDATE_BASE';
export const ADD_NATIONAL_CODE = 'ADD_NATIONAL_CODE';
export const UPDATE_USER_DATA_ENTRY = 'UPDATE_USER_DATA_ENTRY';

export const updateBase = props => {
    return {
        type: UPDATE_BASE,
        ...props
    };
};

export const addNationalCode = nationalCode => {
    return {
        type: ADD_NATIONAL_CODE,
        nationalCode
    };
};

export const updateUserDataEntry = props => {
    return {
        type: UPDATE_USER_DATA_ENTRY,
        ...props
    };
};

export const resetUserDataEntry = _ => {
    return {
        type: UPDATE_BASE,
        userDataEntry: {
            specialClinic: false,
            reciept: null,
            darmangah: null, // MORNING, EVENING, FUTURE
            nationalCode: null,
            insurance:null,
            nationality: null, // IRANIAN, FOREIGN
            speciality: null,
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
        }
    };
};