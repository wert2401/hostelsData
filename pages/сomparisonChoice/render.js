function clickBackBtn() {
    window.location.href = "../clubWheel/clubWheel.html";
}

async function clickApplyBtn() {
    let ch = document.querySelector('input[name="comparison"]:checked').value;
    switch (ch) {
        case "departmentsByQuarter":
            window.location.href = "../periodChoice/periodChoice.html";
            break;
        case "departmentByQuarters":
            window.location.href = "../departmentChoice/departmentChoice.html";
            break;
        case "clubByQuarters":
            window.location.href = "../clubQuarterWheels/clubQuarterWheels.html";
            break;
        default:
            break;
    }
}