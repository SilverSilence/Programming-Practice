//TODO: adds too many fields to body when eating
//TODO: food can be created in snake

/*--------- Variables --------- */

var fieldSize = 15*13;
var directions = { 38: "up", 40: "down", 37 : "left", 39: "right"};

var snake = {
    direction : "up",
    queue : [],
    ids : [],
    head : {},
    tail : {},
};

var gameLoop;
var foodField;
var ateFood;
var stepSpeed = 500;

/*-------------- Game Functions ---------- */

function addFieldToBody(field) {
    snake.queue.unshift(field);
    snake.ids.unshift(field.id);
    field.classList.add("snake");
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
        if (!snake.ids.includes(fieldId)) {
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

function moveSnake() {
    var nextHead = getNextHead();
    removeHead();
    
    makeHead(nextHead);
    if (!ateFood) {
        removeTail();
    }
}

function checkCollision() {
    if (snake.queue.length > 1 && snake.ids.lastIndexOf(snake.head.id) > 0) {
        clearInterval(gameLoop);
        alert("You collided. Game Over.");
    }
}

function checkFood() {
    ateFood = snake.head.id === foodField.id;
    if(ateFood) {
        removeFoodClass();
        addFieldToBody(foodField);
        createFood();
    }
}

function initGameLoop() {
    gameLoop = setInterval(function() {
        moveSnake();
        checkCollision();
        checkFood();
    }, stepSpeed);
}

function setup() {
    drawField();
    initSnake();
    createFood();
    initGameLoop();
};

function main() {
    setup();
};

function drawField() {
    var body = document.body;
    for (var i = 0; i < fieldSize; i++) {
        var div = document.createElement("div");
        div.id = i;
        div.setAttribute("row", Math.floor(i / 15) + 1);
        div.setAttribute("column", i % 15 + 1);
        div.setAttribute("tail", false);
        div.classList.add("field");
        body.appendChild(div);
    }
};

document.addEventListener('DOMContentLoaded', main, false);
document.onkeydown = function(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    if([37,38,39,40].includes(parseInt(charCode))) {
        snake.direction = directions[charCode.toString()];
    }
};