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
    let temp = {}

    Object.keys(data).forEach(k => {
        let groupsId = []
        data[k].forEach(element => {
            if (!groupsId.includes(element[columnName])) {
                groupsId.push(element[columnName]);
            }
        });

        let divData = {}

        groupsId.forEach(element => {
            divData[element] = [];
        });

        data[k].forEach(element => {
            divData[element[columnName]].push(element);
        });

        temp[k] = divData;
    })

    return temp;
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

async function SetDepChoice(depChoice) {
    return await ipcRenderer.invoke("setDepChoice", depChoice);
}

async function GetDepChoice() {
    return await ipcRenderer.invoke("getDepChoice");
}

contextBridge.exposeInMainWorld('data', {
    all: async() => await convertExcelFileToJsonUsingXlsx(),
    divideByGroups: (data, columnName) => getGroupsByColumnName(data, columnName),
    avarageByKeys: (obj) => getAvarageValuesByKeys(obj),
    openFile: () => openAndSetFilePath(),
    file: () => getFilePath(),
    setFilter: async(filter) => await SetFilter(filter),
    getFilter: async() => await GetFilter(),
    setDepChoice: async(depChoice) => await SetDepChoice(depChoice),
    getDepChoice: async() => await GetDepChoice(),
});

async function getConfingSegments(data) {
    let segments = []
    filter = await GetFilter();
    Object.keys(data).forEach(el => {
        if (!filter.unsedColumns.includes(el)) {
            let color = "#5CB975";
            if (data[el] >= 5 && data[el] < 8) {
                color = "#FBC937";
            }
            if (data[el] < 5) {
                color = "#EE685D";
            }
            segments.push({ color: color, text: el, level: data[el] })
        }
    })
    return segments;
}

contextBridge.exposeInMainWorld('wheelService', {
    getConfigSegments: async(data) => await getConfingSegments(data)
});