const { contextBridge } = require('electron');
const xlsx = require('xlsx');

function convertExcelFileToJsonUsingXlsx(path) {
    // Read the file using pathname
    const file = xlsx.readFile(path);
    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;
    const totalSheets = sheetNames.length;
    // Variable to store our data 
    let parsedData = [];
    // Loop through sheets
    for (let i = 0; i < totalSheets; i++) {
        // Convert to json using xlsx
        const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
        // Skip header row which is the colum names
        tempData.shift();
        // Add the sheet's json to our data array
        parsedData.push(...tempData);
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

function getAvarageValues(dividedData) {
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

contextBridge.exposeInMainWorld('data', {
    all: (path) => convertExcelFileToJsonUsingXlsx(path),
    divideByGroups: (data, columnName) => getGroupsByColumnName(data, columnName),
    avarage: (dividedData) => getAvarageValues(dividedData),
    test: () => "Test"
});