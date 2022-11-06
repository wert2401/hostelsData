function clickFileBtn() {
    data.openFile().then(async c => {
        let p = await data.file();
        if (p != "")
            window.location.href = "../settings/settings.html";
    });
}

// //data объявляется в конце excelReader.js
// let json = data.all('./excel/data.xlsx');
// console.log("Все записи", json);

// //Среднее по всему кварталам
// let avarageAll = data.avarageByKeys(json);
// console.log("Среднее по всем данным", avarageAll);

// //Квартал 1 (json[Object.keys(json)[0]], 0 отвечает за номер квартала)
// let divData = data.divideByGroups(json[Object.keys(json)[0]], 'Из какого вы общежития?');
// console.log("Группированне записи", divData);

// console.log("Средние по группам");
// let avarage5 = data.avarageByKeys(divData[5]);
// console.log(avarage5);

// let avarage21 = data.avarageByKeys(divData[21]);
// console.log(avarage21);

// let avarage30 = data.avarageByKeys(divData[30]);
// console.log(avarage30);

// let avarage = data.avarage(divData);
// console.log("Группированные средние", avarage);