const {app, BrowserWindow, ipcMain, remote} = require('electron');
const {autoUpdater} = require('electron-updater');
const log = require('electron-log');
const path = require('path');
const url = require('url');
var edge = require('electron-edge-js');
var shell = require('shelljs')
const {dialog} = require('electron');
var callDll = edge.func(path.join(__dirname, 'dll/electronlib.dll'));
//shell.config.execPath = shell.which('powershell');
shell.config.execPath = path.join('C:', 'Program Files', 'nodejs', 'node.exe');
const {exec} = require("child_process");

let mainWindow;
console.log(__dirname);



const createWindow = () => {
    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';
    log.info('App starting...');
    mainWindow = new BrowserWindow({
        icon: path.join(__dirname + '/icon.ico'),
        title: 'Shafadoc Stand Panel',
        width: 1000,
        height: 700,
        fullscreen: process.env.DEBUG_MOOD ? false : true,
        show: false,
        webPreferences: {
            contextIsolation: false,
            webSecurity: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            preload: path.join(__dirname + '/preload.js')
        },
    });
    mainWindow.loadURL(
        !app.isPackaged
            ? process.env.ELECTRON_START_URL
            : url.format({
                pathname: path.join(__dirname, '../index.html'),
                protocol: 'file:',
                slashes: true,
            })
    );

    if (process.env.DEBUG_MOOD) {
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.setMenu(null);
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
         mainWindow = null;
        // e.preventDefault();
        // mainWindow.destroy();
    });

    // mainWindow.on('close', (e) => {
    //     // mainWindow = null;
    //     e.preventDefault();
    //     mainWindow.destroy();
    // });

    ipcMain.on('closeApp', (event, args) => {
        event.preventDefault();
        process.exit();
    });

    ipcMain.on('callPos', (event, multi, pos_ip, priceAmount, priceAmountMeta, metadata) => {
        event.preventDefault();

        if (process.env.NO_POS) {
            event.reply('callPos', {result: {ResponseCode: '00'}});
            return;
        }

        if (multi) {
            var payload = {func: 'pos2', pos_ip, priceAmount, priceAmountMeta, metadata};
            console.log(payload);

            callDll(payload, function (error, result) {
                if (error) throw error;

                console.log('callPos', {multi, pos_ip, priceAmount, priceAmountMeta, metadata}, result)
                event.reply('callPos', result);
            });
        } else {
            var payload = {func: 'pos', pos_ip, priceAmount, metadata};
            console.log(payload);

            callDll(payload, function (error, result) {
                if (error) throw error;

                console.log('callPos', {multi, pos_ip, priceAmount, priceAmountMeta, metadata}, result)
                event.reply('callPos', result);
            });
        }
    });

    ipcMain.on('getPriceAmount', (event, nodeId, docId, insurId, age, priceAmount, shafaDocUrl) => {
        event.preventDefault();

        const payload = {func: 'getKodakanPrice', nodeId, docId: docId, insurId:insurId.toString(), age, priceAmount, shafaDocUrl};
        console.log(payload);

        callDll(payload, function (error, result) {
            if (error) throw error;

            console.log('farshad');
            event.reply('getPriceAmount', result);
        });
    });

    ipcMain.on('getPsychoPriceAmount', (event, nodeId, docId, insurId, priceAmount, shafaDocUrl) => {
        event.preventDefault();

        const payload = {func: 'getFirstTimePsychoPrice', nodeId, docId: docId, insurId:insurId.toString(), priceAmount, shafaDocUrl};
        console.log(payload);

        callDll(payload, function (error, result) {
            if (error) throw error;

            console.log('farshad');
            console.log(result)
            event.reply('getPsychoPriceAmount', result);
        });
    });

    ipcMain.on('sendReserveToShafadoc', (event, data) => {
        event.preventDefault();

        var payload = {
            func: 'add2WebService',
            shafaDocUrl: `${data.shafaDocUrl || ''}`, // دست نزن فضول
            nodeId: `${data.nodeId || ''}`,
            docID: `${data.docID || ''}`,
            docCode: `${data.docCode || ''}`,
            Of_time: `${data.Of_time || ''}`,
            patientCodeMelli: `${data.patientCodeMelli || ''}`,
            turnNo: `${data.turnNo || ''}`,
            paymentAmount: `${data.paymentAmount || '0'}`,
            transactionID: `${data.transactionID || '0'}`,
            firstName: `${data.firstName || ''}`,
            lastName: `${data.lastName || ''}`,
            fatherFirstName: `${data.fatherFirstName || 'خالی'}`,
            specialtySlug: `${data.specialtySlug || ''}`,
            birthDate: `${data.birthDate || ''}`,
            gender: `${data.gender || ''}`,
            mobileNumber: `${data.mobileNumber || '0'}`,
            insurId: `${data.insurId || ''}`,
            insurNumber: `${data.insurNumber || ''}`
        };

        callDll(payload, function (error, result) {
            if (error) throw error;

            console.log('sendReserveToShafadoc', payload, result);
            event.reply('sendReserveToShafadoc', result);
        });
    });

    ipcMain.on('callUpInsurance', (event, codemelli, resultPath) => {
        event.preventDefault();
        var res = shell.exec(`${path.join(__dirname, 'dll', 'cli', 'electronCli.exe')} callup ${codemelli}`);
        console.log('callUpInsurance', codemelli, res);
        if (res.stdout.trim() === 'done') {
            try {
                const fs = require('fs');
                let rawdata = fs.readFileSync(resultPath);
                let student = JSON.parse(rawdata);
                event.reply('callUpInsurance', student);
            } catch (e) {
                event.reply('callUpInsurance', null);
            }
        } else {
            event.reply('callUpInsurance', null);
        }
    });

    ipcMain.on('getInsuranceMap', (event, path) => {
        event.preventDefault();
        console.log('getInsuranceMap', path);
        try {
            const fs = require('fs');
            let rawdata = fs.readFileSync(path);
            let data = JSON.parse(rawdata);
            console.log(data);
            event.reply('getInsuranceMap', data);
        } catch (e) {
            event.reply('getInsuranceMap', null);
        }
    });

    ipcMain.on('person', (event, nationalCode, birthYear, personPath) => {
        event.preventDefault();

        exec(`${path.join(__dirname, 'dll', 'cli', 'electronCli.exe')} person ${nationalCode} ${birthYear}`, (error, stdout, stderr) => {
            if (error || stderr) {
                event.reply('person', null);
                return;
            }

            console.log('person', {nationalCode, birthYear, personPath}, {error, stdout, stderr});
            try {
                if (stdout.trim() === 'done') {
                    const fs = require('fs');
                    let rawdata = fs.readFileSync(personPath);
                    let student = JSON.parse(rawdata);
                    event.reply('person', student);
                } else {
                    event.reply('person', null);
                }
            } catch (e) {
                event.reply('person', null);
            }
        });
        // var res = shell.exec(`${path.join(__dirname, 'dll', 'cli', 'electronCli.exe')} person ${nationalCode} ${birthYear}`);

        // console.log('person', {nationalCode, birthYear, personPath}, res);
        // if (res.stdout) {
        //     const fs = require('fs');
        //     let rawdata = fs.readFileSync(personPath);
        //     let student = JSON.parse(rawdata);
        //     event.reply('person', student);
        // } else {
        //     event.reply('person', null);
        // }
    });

    //todo این قابلیت برای مراکز خاص بایستی فعال گردد.
    ipcMain.on('generateHID', (event, codemelli, docCode, insurer, inquiryId) => {
        event.preventDefault();

        exec(`"${path.join(__dirname, 'dll', 'cli', 'electronCli.exe')}" getHid ${codemelli} ${docCode} ${insurer} ${inquiryId}`, (error, stdout, stderr) => {
            if (error || stderr) {
                event.reply('person', null);
                return;
            }

            console.log('generateHID', {codemelli, docCode, insurer, inquiryId}, {error, stdout, stderr});
            if (stdout) {
                event.reply('generateHID', stdout);
            }
        });
    });

    ipcMain.on('printerList', event => {
        let printWindow = new BrowserWindow({'auto-hide-menu-bar': true, show: false});
        printWindow.loadURL("www.google.com");
        let list = printWindow.webContents.getPrinters();
        event.reply('printerList', list);
    });

    ipcMain.on('browse', (event) => {
        dialog.showOpenDialog({properties: ['openFile']})
            .then(data => {
                event.reply('browse', data);
            });
    });

    ipcMain.on('print', (event, options) => {
        console.log('print', options);
        mainWindow.webContents.print({...options, silent: process.env.SILENT ? false : true, printBackground: false});

        event.reply('print');
    });

    autoUpdater.checkForUpdates();
};

app.on('ready', createWindow);

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Ok'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version is being downloaded.'
    }
    dialog.showMessageBox(dialogOpts, (response) => {

    });
})

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
});

app.on('window-all-closed', () => {
    // if (process.platform !== 'darwin') {
    try {
        app.quit();
    } catch (e) {
    }
    // }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});