function clickBackBtn() {
    window.location.href = "../main/main.html";
}

async function clickApplyBtn() {
    let json = await data.all();

    let unusedCoolumns = [];

    let checks = document.getElementsByName("exclude_cols");
    checks.forEach(c => {
        if (c.checked) {
            unusedCoolumns.push(c.value);
        }
    })

    let filter = {
        columnGroup: document.getElementById("columnGroup").value,
        unsedColumns: unusedCoolumns
    }

    await data.setFilter(filter);

    window.location.href = "../clubWheel/clubWheel.html";
}

data.all().then(d => {
    let avarageAll = data.avarageByKeys(d);
    let count = 0;
    Object.keys(avarageAll).forEach(k => {
        let node = document.createElement("option");
        node.innerHTML = k;
        node.value = k;
        document.getElementById("columnGroup").appendChild(node);

        document.getElementById("filterColumns").innerHTML += `
        <div>
            <input type="checkbox" id="col${count}" name="exclude_cols" value="${k}" />
            <label for="col${count}">${k}</label>
        </div>
        `;

        count += 1;
    });
});