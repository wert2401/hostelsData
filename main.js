const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

let MyState = {
    filePath: "",
    filter: {
        columnGroup: "",
        unsedColumns: []
    },
    depChoice: "",
}

async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Excel', extensions: ['xlsx'] }] });
    if (canceled) {
        return "";
    } else {
        return filePaths[0];
    }
}

async function getFilePath() {
    return MyState.filePath;
}

async function setFilePath(event, path) {
    MyState.filePath = path;
}

async function getFilter() {
    return MyState.filter;
}

async function setFilter(event, filter) {
    MyState.filter = filter;
}

async function setDepChoice(event, depChoice) {
    MyState.depChoice = depChoice;
}

async function getDepChoice() {
    return MyState.depChoice;
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'excelReader.js')
        },
        icon: __dirname + '/wheel_icon.ico',
    })

    win.loadFile('pages/main/main.html')
}

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)
    ipcMain.handle("getFilePath", getFilePath)
    ipcMain.handle("setFilePath", setFilePath)
    ipcMain.handle("getFilter", getFilter)
    ipcMain.handle("setFilter", setFilter)
    ipcMain.handle("setDepChoice", setDepChoice)
    ipcMain.handle("getDepChoice", getDepChoice)
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})