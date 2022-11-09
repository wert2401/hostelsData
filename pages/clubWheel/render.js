function clickBackBtn() {
    window.location.href = "../settings/settings.html";
}

async function clickApplyBtn() {
    window.location.href = "../сomparisonChoice/comparisonChoice.html";
}

(async() => {
    let filter = await data.getFilter();
    let alldata = await data.all();
    let averData = data.avarageByKeys(alldata);

    console.log(filter);
    console.log(data.avarageByKeys(alldata));

    var config = {};

    config.segments = await wheelService.getConfigSegments(averData);

    config.radius = 200; // optional. Default calculated based in canvas size
    config.levels = 10; // optional. Default 10
    config.fontSize = 15; // optional. Default 15px

    let canvas = document.getElementById("canvas");

    const wheel = new Wheel(canvas, config);
    wheel.draw();

    canvas.click(false);
})();