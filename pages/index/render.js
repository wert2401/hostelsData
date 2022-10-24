let json = data.all('./excel/data.xlsx');
console.log(json);

let divData = data.divideByGroups(json, 'Из какого вы общежития?')
console.log(divData);

let avarage = data.avarage(divData);
console.log(avarage);