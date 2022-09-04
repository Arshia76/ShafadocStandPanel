import {hubConnection} from 'signalr-no-jquery';
import App from "./App";

const signalRRequestTimeoutMessage = 'خطا در برقراری ارتباط بعدا دوباره سعی کنید.';
const signalRRequestTimeoutDuration = 60000;

class signalR {
    constructor() {
        signalR.hubProxy.on("setDocOfSp", (value) => {
            var dvalue = JSON.parse(value);
            console.log(dvalue);
            signalR.setDocOfSp(dvalue["Data"]);
        });
        signalR.hubProxy.on("setDocOfSpFirstShift", (value) => {
            var dvalue = JSON.parse(value);
            signalR.setDocOfSpFirstShift(dvalue["Data"]);
        });
        signalR.hubProxy.on("setDocOfSpSecondShift", (value) => {
            var dvalue = JSON.parse(value);
            signalR.setDocOfSpSecondShift(dvalue["Data"]);
        });
        signalR.hubProxy.on("setServices", (value) => {
            var dvalue = JSON.parse(value);
            signalR.setServices(dvalue["Data"]);
        });
        signalR.hubProxy.on("setSpes", (value) => {
            var dvalue = JSON.parse(value);
            signalR.setSpDocs(dvalue["Data"]);
        });
        signalR.hubProxy.on("setAccountingSettings",(value)=>{
            var dvalue = JSON.parse(value);
            signalR.setAccountingSettings(dvalue["Data"]);
        });

        signalR.hubProxy.on("setSpesFirst", (value, flag, startTime) => {
            try {
                var dvalue = JSON.parse(value);
                signalR.setSpesFirst(dvalue["Data"], flag, startTime);
            } catch (ex) {
                console.error('Error!', ex);
            }
        });
        signalR.hubProxy.on("setSpesSecond", (value, flag, startTime) => {
            try {
                var dvalue = JSON.parse(value);
                signalR.setSpesSecond(dvalue["Data"], flag, startTime);
            } catch (ex) {
                console.error('Error!', ex);
            }
        });
        signalR.hubProxy.on("setResStartNo", (value) => {
            var dvalue = JSON.parse(value);
            signalR.setResStartNo(dvalue["Data"]);
        });
        signalR.hubProxy.on("setReserveNo", (value) => {
            var dvalue = JSON.parse(value);
            signalR.privateResNoListener(dvalue["Data"]);
        });
        signalR.hubProxy.on("shutdown", (value) => {
            // shutDown();
        });
        signalR.hubProxy.on("setInternetResInfo", (value) => {
            var dvalue = JSON.parse(value);
            signalR.privateInternetResInfoListener(dvalue["Data"]);
        });
        signalR.hubProxy.on("setPriceAmount", (value) => {
            var dvalue = JSON.parse(value);
            signalR.privatePriceAmountListener(dvalue["Data"]);
        });
        signalR.hubProxy.on("setInsurences", (value) => {
            var dvalue = JSON.parse(value);
            signalR.setInsurences(dvalue["Data"]);
        });

        return new Promise((resolve, reject) => {
            signalR.connection.start()
                .done(_ => {
                    signalR.$connectionStatus = true;
                    console.log('Now connected, connection ID=' + signalR.connection.id);

                    resolve(signalR.connection.id);
                })
                .fail(_ => {
                    console.warn('Could not connect');
                    reject();
                });
        });
    }

    static $connectionStatus = false;
    static connection = hubConnection(App.storage.get('redux')?.setting?.serverDomain);
    static hubProxy = signalR.connection.createHubProxy('kioskHub');
    static privateResNoListener = signalR.publicReserveListener;

    static getDocOfSp($spId) {
        console.log($spId);
        if (signalR.connection.id)
            signalR.hubProxy.invoke("getDocOfSp", signalR.connection.id, JSON.stringify({"command": "getDocOfSp", "Data": {"spId": $spId}}));
    };

    static getDocOfSpFirstShift($spId) {
        if (signalR.connection.id)
            signalR.hubProxy.invoke("getDocOfSpFirstShift", signalR.connection.id, JSON.stringify({"command": "getDocOfSpFirstShift", "Data": {"spId": $spId}}));
    };

    static getDocOfSpSecondShift($spId) {
        if (signalR.connection.id)
            signalR.hubProxy.invoke("getDocOfSpSecondShift", signalR.connection.id, JSON.stringify({"command": "getDocOfSpSecondShift", "Data": {"spId": $spId}}));
    };

    static getAccountingSettings($tId) {
        if (signalR.connection.id)
            signalR.hubProxy.invoke("getAccountingSettings", signalR.connection.id, JSON.stringify({"command": "getAccountingSettings", "Data": {"tId": $tId}}));
    };

    static getInternetResInfo($codeMeli) {
        const promise = new Promise((resolve, reject) => {
            signalR.privateInternetResInfoListener = (data) => {
                if (data?.length)
                    resolve(data[0]);
                else
                    reject('اطلاعاتی برای این کد ملی ثبت نشده است.');

                signalR.publicInternetResInfoListener(data);
            };

            setTimeout(_ => {
                reject(signalRRequestTimeoutMessage);
            }, signalRRequestTimeoutDuration);
        });

        if (signalR.connection.id)
            signalR.hubProxy.invoke("getInternetResInfo", signalR.connection.id, JSON.stringify({"command": "getInternetResInfo", "Data": {"codeMeli": $codeMeli}}));

        return promise;
    };

    static getPriceAmount($serviceId, $insurId) {
        console.log($serviceId, $insurId);

        const promise = new Promise((resolve, reject) => {
            signalR.privatePriceAmountListener = (data) => {
                resolve(data);

                signalR.publicPriceAmountListener(data);
            };

            setTimeout(_ => {
                reject(signalRRequestTimeoutMessage);
            }, signalRRequestTimeoutDuration);
        });

        if (signalR.connection.id)
            signalR.hubProxy.invoke("getPriceAmount", signalR.connection.id, "{\"command\": \"getPriceAmount\", \"Data\": { \"serviceId\":" + $serviceId + ", \"insurId\":" + $insurId + "} }");

        return promise;
    };

    static getResStartNo() {
        if (signalR.connection.id)
            signalR.hubProxy.invoke("getResStartNo", signalR.connection.id, JSON.stringify({"command": "getResStartNo", "Data": ""}));
    };

    static getServices() {
        if (signalR.connection.id)
            signalR.hubProxy.invoke("getServices", signalR.connection.id, JSON.stringify({"command": "getServices", "Data": {}}));
    };

    static getSpes() {
        if (signalR.connection.id)
            signalR.hubProxy.invoke("getSpes", signalR.connection.id, JSON.stringify({"command": "getSpes"}));
    };

    static getSpesFirst() {
        if (signalR.connection.id)
            signalR.hubProxy.invoke("getSpesFirst", signalR.connection.id, JSON.stringify({"command": "getSpesSecond"}));
    };

    static getSpesSecond() {
        if (signalR.connection.id)
            signalR.hubProxy.invoke("getSpesSecond", signalR.connection.id, JSON.stringify({"command": "getSpesSecond"}));
    };

    static publicInternetResInfoListener = _ => console.log('publicInternetResInfoListener');

    static privateInternetResInfoListener = signalR.publicInternetResInfoListener;

    static publicPriceAmountListener = _ => console.log('publicPriceAmountListener');

    static privatePriceAmountListener = signalR.publicPriceAmountListener;

    static publicResNoListener = _ => console.log('publicReserveListener');

    static reserve($spId, $docId, $tId, $codeMeli) {
        console.log($spId, $docId, $tId, $codeMeli);

        const promise = new Promise((resolve, reject) => {
            signalR.privateResNoListener = (data) => {
                resolve(data);

                signalR.publicResNoListener(data);
            };

            setTimeout(_ => {
                reject(signalRRequestTimeoutMessage);
            }, signalRRequestTimeoutDuration);
        });

        if (signalR.connection.id)
            signalR.hubProxy.invoke("reserve", signalR.connection.id, JSON.stringify({"command": "reserve", "Data": {"spId": $spId, "docId": $docId, "tId": $tId, "codeMeli": $codeMeli}}));

        return promise;
    };

    static reserveService($serId, $tId, $codeMeli) {
        if (signalR.connection.id)
            signalR.hubProxy.invoke("reserveService", signalR.connection.id, JSON.stringify({"command": "reserveService", "Data": {"serId": $serId, "tId": $tId, "codeMeli": $codeMeli}}));
    };

    static setDocOfSp = _ => console.log('setDocOfSp');

    static setAccountingSettings=_=>console.log("setAccountingSettings");

    static setDocOfSpFirstShift = _ => console.log('setDocOfSpFirstShift');

    static setDocOfSpSecondShift = _ => console.log('setDocOfSpSecondShift');

    static setInsurences = _ => console.log('setInsurences');

    static setPayData($Data) {
        if (signalR.connection.id)
            signalR.hubProxy.invoke("setPayData", signalR.connection.id, JSON.stringify({"command": "setPayData", "Data": $Data}));
    };

    static setResStartNo = _ => console.log('setResStartNo');

    static setServices = _ => console.log('setServices');

    static setSpes = _ => console.log('setSpes');

    static setSpesFirst = _ => console.log('setSpesFirst');

    static setSpesSecond = _ => console.log('setSpesSecond');

    static shutdown = _ => console.log('shutdown');

    static vipReserve($spId, $docId) {
        if (signalR.connection.id)
            signalR.hubProxy.invoke("vipReserve", signalR.connection.id, JSON.stringify({"command": "vipReserve", "Data": {"spId": $spId, "docId": $docId}}));
    };
}

export default signalR;

