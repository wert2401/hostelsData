let json = data.all('./excel/data.xlsx');
console.log("Все записи", json);

let divData = data.divideByGroups(json, 'Из какого вы общежития?');
console.log("Группированне записи", divData);

console.log("Средние по группам");
let avarage5 = data.avarageByKeys(divData[5]);
console.log(avarage5);

let avarage21 = data.avarageByKeys(divData[21]);
console.log(avarage21);

let avarage30 = data.avarageByKeys(divData[30]);
console.log(avarage30);

let avarage = data.avarage(divData);
console.log("Группированные средние", avarage);