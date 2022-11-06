const { contextBridge, ipcRenderer } = require('electron');
const xlsx = require('xlsx');

async function convertExcelFileToJsonUsingXlsx() {
    let path = await getFilePath();
    // Read the file using pathname
    const file = xlsx.readFile(path);
    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;
    const totalSheets = sheetNames.length;
    // Variable to store our data 
    let parsedData = {};
    // Loop through sheets
    for (let i = 0; i < totalSheets; i++) {
        // Convert to json using xlsx
        const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
        // Skip header row which is the colum names
        tempData.shift();
        // Add the sheet's json to our data array
        parsedData[sheetNames[i]] = [...tempData];
    }
    return parsedData;
}

function getGroupsByColumnName(data, columnName) {
    let groupsId = []
    data.forEach(element => {
        if (!groupsId.includes(element[columnName])) {
            groupsId.push(element[columnName]);
        }
    });

    let divData = {}

    groupsId.forEach(element => {
        divData[element] = [];
    });

    data.forEach(element => {
        divData[element[columnName]].push(element);
    });

    return divData;
}

function getValuesWithKeys(obj) {
    let result = [];

    let vals = Object.values(obj);
    let keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const val = vals[i];

        if (typeof obj[key] != 'object')
            result.push({
                [key]: val
            });
        else
            result.push(...getValuesWithKeys(vals[i]));
    }

    return result;
}

function getAvarageValuesByKeys(obj) {
    let res = {};
    let counts = {};

    let objs = getValuesWithKeys(obj);
    objs.forEach(element => {
        let key = Object.keys(element)[0];
        let value = Object.values(element)[0];
        if (typeof value == 'number') {
            if (Object.keys(res).includes(key)) {
                res[key] += value;
            } else {
                res[key] = value;
            }
            if (Object.keys(counts).includes(key)) {
                counts[key] += 1;
            } else {
                counts[key] = 1;
            }
        }
    });

    Object.keys(counts).forEach(key => {
        res[key] = res[key] / counts[key];
    })

    return res;
}

function getAvarageValuesByGroups(dividedData) {
    let avarage = {}
    let groupsId = Object.keys(dividedData);

    groupsId.forEach(group => {
        let values = {};

        dividedData[group].forEach(element => {
            let columns = Object.keys(element)
            columns.forEach(column => {
                if (typeof element[column] == 'number') {
                    let num = Number.parseFloat(element[column]);

                    if (Object.keys(values).includes(column))
                        values[column] += num;
                    else
                        values[column] = num;
                }
            });
        });

        let columns = Object.keys(values)
        columns.forEach(col => {
            values[col] = values[col] / dividedData[group].length;
        });

        avarage[group] = values;
    });

    return avarage;
}

function openAndSetFilePath() {
    return ipcRenderer.invoke('dialog:openFile').then(c => {
        ipcRenderer.invoke("setFilePath", c);
    });
}

async function getFilePath() {
    return await ipcRenderer.invoke("getFilePath");
}

async function SetFilter(filter) {
    return await ipcRenderer.invoke("setFilter", filter);
}

async function GetFilter() {
    return await ipcRenderer.invoke("getFilter");
}

contextBridge.exposeInMainWorld('data', {
    all: async() => await convertExcelFileToJsonUsingXlsx(),
    divideByGroups: (data, columnName) => getGroupsByColumnName(data, columnName),
    avarage: (dividedData) => getAvarageValuesByGroups(dividedData),
    avarageByKeys: (obj) => getAvarageValuesByKeys(obj),
    openFile: () => openAndSetFilePath(),
    file: () => getFilePath(),
    setFilter: async(filter) => await SetFilter(filter),
    getFilter: async() => await GetFilter(),
});