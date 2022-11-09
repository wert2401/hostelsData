function clickBackBtn() {
    window.location.href = "../periodChoice/periodChoice.html";
}

async function clickApplyBtn() {

}

(async() => {
    let wheels = document.getElementsByClassName("wheels")[0];
    let counter = 0;
    let filter = await data.getFilter();
    let dep = await data.getDepChoice();
    let alldata = await data.all();

    document.getElementsByTagName("h2")[0].innerHTML += dep;

    let divided = data.divideByGroups(alldata, filter.columnGroup);

    Object.keys(divided[dep]).forEach(async key => {
        counter += 1;
        let id = "cavnas" + counter;
        wheels.innerHTML += `
            <div class="wheel">
                <canvas id="${id}" width="500" height="500" style="font: 25px sans-serif;"></canvas>
                <span>${key}</span>
            </div>
        `

        var config = {};

        console.log(dep, key);
        let av = data.avarageByKeys(divided[dep][key]);
        console.log(av)

        config.segments = await wheelService.getConfigSegments(av);

        console.log(config.segments)

        config.radius = 200; // optional. Default calculated based in canvas size
        config.levels = 10; // optional. Default 10
        config.fontSize = 15; // optional. Default 15px

        let canvas = document.getElementById(id);

        const wheel = new Wheel(canvas, config);
        wheel.draw();

        canvas.click(false);
    });
})();