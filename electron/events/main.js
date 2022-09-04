const {ipcMain} = require('electron');

ipcMain.on('closeApp', (event, args) => {
    event.preventDefault();
    process.exit();
});
