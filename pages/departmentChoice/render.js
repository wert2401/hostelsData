function clickBackBtn() {
    window.location.href = "../сomparisonChoice/comparisonChoice.html";
}

async function clickApplyBtn() {

}

/* <div>
    <input type="radio" id="departmentChoice"
        name="department" value="firstDepartment" checked>
    <label for="departmentChoice1">5 общежитие</label>
</div> */

(async() => {
    let alldata = await data.all();
    let filter = await data.getFilter();
    console.log(alldata);
    console.log(filter.columnGroup);
    let divided = data.divideByGroups(alldata, filter.columnGroup)
    console.log(Object.keys(divided));


})();