function clickBackBtn() {
    window.location.href = "../сomparisonChoice/comparisonChoice.html";
}

async function clickApplyBtn() {
    let ch = document.querySelector('input[name="department"]:checked').value;

    if (ch == "" || ch == null || ch == undefined)
        return;

    await data.setDepChoice(ch);
    window.location.href = "../departmentWheels/departmentWheels.html";
}

(async() => {
    let form = document.getElementsByTagName("form")[0];

    let alldata = await data.all();
    let filter = await data.getFilter();

    let divided = data.divideByGroups(alldata, filter.columnGroup)
    let keys = Object.keys(Object.values(divided)[0]);
    keys.forEach(k => {
        form.innerHTML += `
        <div>
            <input type="radio" id="departmentChoice"
            name="department" value="${k}" checked>
            <label for="departmentChoice${k}">${k}</label>
        </div>
        `
    })
})();