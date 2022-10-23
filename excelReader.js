function readXls(path) {
    xlsxj = require("xlsx-to-json");
    xlsxj({
        input: path,
        output: "excel/output.json"
    }, function(err, result) {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    readXls('./excel/data.xlsx');
})

module.exports = { readXls }