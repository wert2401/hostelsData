function clickBackBtn() {
    window.location.href = "../сomparisonChoice/comparisonChoice.html";
}

async function clickApplyBtn() {
    window.location.href = "../departmentWheels/departmentWheels.html"; //вне зависимости от выбора на странице, осуществляется переход на шаблонную страницу с кружками
}

/* <div>
    <input type="radio" id="departmentChoice"
        name="department" value="firstDepartment" checked>
    <label for="departmentChoice1">5 общежитие</label>
</div> */

(async() => {
    let alldata = await data.all();
    let filter = await data.getFilter();
    console.log(Object.keys(divided));
    console.log(Object.keys(divided));
    let divided = data.divideByGroups(alldata, filter.columnGroup)
    console.log(Object.keys(divided));
})();