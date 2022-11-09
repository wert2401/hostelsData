function clickBackBtn() {
    window.location.href = "../settings/settings.html";
}

async function clickApplyBtn() {

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

    let canvas1 = document.getElementById("canvas1");

    const wheel1 = new Wheel(canvas1, config);
    wheel1.draw();

    canvas1.click(false);

    let canvas2 = document.getElementById("canvas2");

    const wheel2 = new Wheel(canvas2, config);
    wheel2.draw();

    canvas2.click(false);

    let canvas3 = document.getElementById("canvas3");

    const wheel3 = new Wheel(canvas3, config);
    wheel3.draw();

    canvas3.click(false);
})();