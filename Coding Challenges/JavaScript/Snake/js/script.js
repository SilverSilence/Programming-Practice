//TODO: adds too many fields to body when eating
//TODO: food can be created in snake

/*--------- Variables --------- */
var rows = 13;
var columns = 15;
var fieldSize = rows * columns;
var directions = { 38: "up", 40: "down", 37 : "left", 39: "right"};

var snake = {
    direction : "up",
    queue : [],
    ids : [],
    head : {},
    tail : {},
};

var colors;
var gameLoop;
var foodField;
var ateFood;
var stepSpeed = 150;

/*-------------- Game Functions ---------- */

function addFieldToBody(field) {
    snake.queue.unshift(field);
    snake.ids.unshift(field.id);
    field.classList.add("snake");
//    field.classList.remove("field");
}

function setupHead(field) {
    field.classList.add("head");
    snake.head = field;
    addFieldToBody(field);
}

function setupTail(field) {
    field.classList.add("tail");
    snake.tail = field;
    addFieldToBody(field);
}

function getFieldById(id) {
    return snake.queue[id];
}

function makeTail() {
    var newLast = snake.queue[snake.queue.length-1];
    newLast.classList.add("tail");
    snake.tail = newLast;
}

function removeTail() {
    snake.queue.pop();
    snake.ids.pop();
    snake.tail.classList.remove("tail");
    snake.tail.classList.remove("snake");
//    snake.tail.style["background-color"] = "white";
    makeTail();
}


function removeHead() {
    snake.queue[0].classList.remove("head");
}

function makeHead(field) {
    addFieldToBody(field);
    snake.queue[0].classList.add("head");
    snake.head = field;
}

/*-------------- Setup Functions ---------- */

function initSnake() {
    var center = document.getElementById(Math.floor(fieldSize/2));
    setupHead(center);
    setupTail(center);
    snake.queue.pop(); //remove duplicate
    snake.ids.pop(); //remove duplicate
}

function removeFoodClass() {
    foodField.classList.remove("food");
}

function createFood() {
     var fieldId;
     while (true) { 
        fieldId = Math.floor(Math.random() * (fieldSize+1));
        if (!snake.ids.includes(fieldId.toString())) {
            break;
        }
    }
    if (foodField) {
        removeFoodClass();
    }
    foodField = document.getElementById(fieldId);
    foodField.classList.add("food");
}

function getNextHead() {
    var nextHead;
    var head = snake.head;
    switch(snake.direction) {
        case "up" :
            nextHead = document.getElementById(parseInt(head.id) - 15);
            break;
        case "down":
            nextHead = document.getElementById(parseInt(head.id) + 15);
            break;
        case "left":
            nextHead = document.getElementById(parseInt(head.id) - 1);
            break;
        case "right":
            nextHead = document.getElementById(parseInt(head.id) + 1);
            break;
        default:
            alert("Direction error.");
            break;
    }
    return nextHead;
}

function moveSnake(nextHead) {
    removeHead();
    makeHead(nextHead);
    if (!ateFood) {
        removeTail();
    }
}

function colorSnake() {
    for (var i = 1; i < snake.queue.length; i++) {
        snake.queue[i].style["background-color"] = "rgb(" + colors[0] + ","+ (colors[1] + i) + "," + colors[2] + ")";
    }
}

function checkCollision() {
    if ((snake.queue.length > 1 && snake.ids.lastIndexOf(snake.head.id) > 0)) {
        clearInterval(gameLoop);
        alert("You collided. Game Over.");
    }
    var dir = snake.head.getAttribute("dir");
    if (dir && dir === snake.direction) {
        clearInterval(gameLoop);
        alert("You collided with border. Game Over.");
    }
}

function checkFood(nextHead) {
    ateFood = nextHead.id === foodField.id;
    if(ateFood) {
        removeFoodClass();
        createFood();
    }
}

function initGameLoop() {
    gameLoop = setInterval(function() {
        checkCollision();
        var nextHead = getNextHead();
        checkFood(nextHead);
        moveSnake(nextHead);
//        colorSnake();
    }, stepSpeed);
}

function getBaseColor() {
    var rgb = window.getComputedStyle(snake.head).color;
    colors = rgb.replace("rgb(", '').replace(")", '').split(', ');
    colors[0] = parseInt(colors[0]);
    colors[1] = parseInt(colors[1]);
    colors[2] = parseInt(colors[2]);
}

function setup() {
    drawField();
    markBorder();
    initSnake();
    getBaseColor();
    createFood();
    initGameLoop();
};
    
function markBorder() {
    var fields = document.getElementsByClassName("field");
    for(var i = 0; i < fieldSize; i++) {
        if (i < 15) {
            fields[i].setAttribute("dir", "up");
        }
        if (i % 15 === 0) {
            fields[i].setAttribute("dir", "left");
        }
        if (i % 15 === 14) {
            fields[i].setAttribute("dir", "right");
        }
        if (i > fieldSize-rows) {
            fields[i].setAttribute("dir", "down");
        }
    }
}

function drawField() {
    var body = document.body;
    for (var i = 0; i < fieldSize; i++) {
        var div = document.createElement("div");
        div.id = i;
        div.setAttribute("row", Math.floor(i / 15) + 1);
        div.setAttribute("column", i % 15 + 1);
        div.classList.add("field");
        body.appendChild(div);
    }
};

document.addEventListener('DOMContentLoaded', setup, false);
document.onkeydown = function(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    if([37,38,39,40].includes(parseInt(charCode))) {
        snake.direction = directions[charCode.toString()];
    }
};