import moment from "jalali-moment";

const {ipcRenderer} = window;

class Main {
    static RequestTimeoutMessage = 'خطا در برقراری ارتباط بعدا دوباره سعی کنید.';
    static RequestTimeoutDuration = 60000;

    static browse() {
        const promise = new Promise((resolve, reject) => {
            ipcRenderer?.once('browse', (event, data) => {
                resolve(data?.filePaths?.[0] || '');
            });

            setTimeout(_ => {
                reject(Main.RequestTimeoutMessage);
            }, Main.RequestTimeoutDuration);
        });

        ipcRenderer?.send('browse');

        return promise;
    }

    static callPos(multi = false, ip, price, charge, metadata) {
        const promise = new Promise((resolve, reject) => {
            ipcRenderer?.once('callPos', (event, result) => {
                resolve(result);
            });

            setTimeout(_ => {
                reject(Main.RequestTimeoutMessage);
            }, Main.RequestTimeoutDuration);
        });

        ipcRenderer?.send('callPos', multi, ip, price, charge, metadata);

        return promise
    }

    static callUpInsurance(nationalCode, resultPath) {
        console.log(nationalCode, resultPath);
        const promise = new Promise((resolve, reject) => {
            ipcRenderer?.once('callUpInsurance', (event, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject();
                }
            });

            setTimeout(_ => {
                reject(Main.RequestTimeoutMessage);
            }, Main.RequestTimeoutDuration);
        });

        ipcRenderer?.send('callUpInsurance', nationalCode, resultPath);

        return promise;
    }

    static closeApp() {
        ipcRenderer?.send('closeApp');
    }

    static generateHID(nationalCode, docCode, insurer, inquiryId) {
        const promise = new Promise((resolve, reject) => {
            ipcRenderer?.once('generateHID', (event, data) => {
                resolve(data);
            });

            setTimeout(_ => {
                reject(Main.RequestTimeoutMessage);
            }, Main.RequestTimeoutDuration);
        });

        ipcRenderer?.send('generateHID', nationalCode, docCode, insurer, inquiryId);

        return promise;
    }

    static getInsuranceMap(path) {
        const promise = new Promise((resolve, reject) => {
            ipcRenderer?.once('getInsuranceMap', (event, list) => {
                console.log(list);
                resolve(list);
            });

            setTimeout(_ => {
                reject(Main.RequestTimeoutMessage);
            }, Main.RequestTimeoutDuration);
        });

        ipcRenderer?.send('getInsuranceMap', path);

        return promise;
    }

    static getPriceAmount(nodeId, docId, insurId, age, priceAmount, shafaDocUrl) {
        console.log('getPriceAmount', nodeId, docId, insurId, age, priceAmount, shafaDocUrl)

        const promise = new Promise((resolve, reject) => {
            ipcRenderer?.once('getPriceAmount', (event, result) => {
                resolve(result);
            });

            setTimeout(_ => {
                reject(Main.RequestTimeoutMessage);
            }, Main.RequestTimeoutDuration);
        });


        ipcRenderer?.send('getPriceAmount', nodeId, docId, insurId, age, priceAmount, shafaDocUrl);

        return promise
    }

    static getPsychoPriceAmount(nodeId, docId, insurId, priceAmount, shafaDocUrl) {
        console.log('getPsychoPriceAmount', nodeId, docId, insurId, priceAmount, shafaDocUrl)

        const promise = new Promise((resolve, reject) => {
            ipcRenderer?.once('getPsychoPriceAmount', (event, result) => {
                resolve(result);
            });

            setTimeout(_ => {
                reject(Main.RequestTimeoutMessage);
            }, Main.RequestTimeoutDuration);
        });


        ipcRenderer?.send('getPsychoPriceAmount', nodeId, docId, insurId, priceAmount, shafaDocUrl);

        return promise
    }

    static person(nationalCode, birthYear, personPath) {
        console.log(nationalCode, birthYear, personPath);
        const promise = new Promise((resolve, reject) => {
            ipcRenderer?.once('person', (event, result) => {
                console.log('end', moment().format());
                if (result) {
                    resolve(result);
                } else {
                    reject();
                }
            });

            setTimeout(_ => {
                reject(Main.RequestTimeoutMessage);
            }, 120000);
        });

        console.log('start', moment().format());
        ipcRenderer?.send('person', nationalCode, birthYear, personPath);

        return promise;
    }

    static print(url, options = {}) {
        const promise = new Promise((resolve, reject) => {
            ipcRenderer?.once('print', event => {
                resolve();
            });

            setTimeout(_ => {
                reject(Main.RequestTimeoutMessage);
            }, Main.RequestTimeoutDuration);
        });

        ipcRenderer?.send('print', url, options);

        return promise;
    }

    static printerList() {
        const promise = new Promise((resolve, reject) => {
            ipcRenderer?.once('printerList', (event, list) => {
                resolve(list);
            });

            setTimeout(_ => { 
                reject(Main.RequestTimeoutMessage);
            }, Main.RequestTimeoutDuration);
        });

        ipcRenderer?.send('printerList');

        return promise;
    }

    static sendReserveToShafadoc(data) {
        const promise = new Promise((resolve, reject) => {
            ipcRenderer?.once('sendReserveToShafadoc', (event, result) => {
                resolve(result);
            });

            setTimeout(_ => {
                reject(Main.RequestTimeoutMessage);
            }, Main.RequestTimeoutDuration);
        });

        console.log(data);
        ipcRenderer?.send('sendReserveToShafadoc', data);

        return promise
    }
}

export default Main;