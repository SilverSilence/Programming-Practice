
var fieldSize = 450;


function main() {
    setup();
};

function drawField {
    var body = document.body;
    for (var i = 0; i < fieldSize; i++) {
        var div = document.createElement("div");
        div.id = i;
        div.row = i % 15;
        div.column = i % 30
    }
};

document.addEventListener('DOMContentLoaded', main, false);