function clickBackBtn() {
    window.location.href = "../сomparisonChoice/comparisonChoice.html";
}

async function clickApplyBtn() {
    let ch = document.querySelector('input[name="period"]:checked').value;

    if (ch == "" || ch == null || ch == undefined)
        return;

    await data.setDepChoice(ch);
    window.location.href = "../quarterWheels/quarterWheels.html";
}

(async() => {
    let form = document.getElementsByTagName("form")[0];
    form.innerHTML = "";

    let alldata = await data.all();
    let filter = await data.getFilter();

    let divided = data.divideByGroups(alldata, filter.columnGroup)
    let keys = Object.keys(divided);
    keys.forEach(k => {
        form.innerHTML += `
        <div>
            <input type="radio" id="periodChoice${k}"
                name="period" value="${k}" checked>
            <label for="periodChoice${k}">${k}</label>
        </div>
        `
    })
})();