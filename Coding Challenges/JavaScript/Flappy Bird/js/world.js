var framerate = 15;
var intervalId;

/*--------------- OBSTACLES ----------- */

var obstacleSpeed = 1;
var obstacleSpawnCounter = 0;
var obstacleSpawnRate = 150; //1000 / framerate --> 1 obstacle / second

//Height is 400px. If you want at least half of it to be open, make the obstacle occupy 200px.
function Obstacle() {
    this.lengthTop = Math.random() * 100 + 1;
    this.lengthBot = 200 - this.lengthTop;
}

function createObstacle() {
    var obstacle = new Obstacle();

    var divTop = document.createElement("div");
    var divBot = document.createElement("div");

    divBot.style["height"] = obstacle.lengthBot + "px";
    divTop.style["height"] = obstacle.lengthTop + "px";

    divBot.style["margin-left"] = 980 + "px";
    divTop.style["margin-left"] = 980 + "px";

    divBot.style["margin-top"] = 400 - obstacle.lengthBot + "px";

    divBot.classList.add("obstacle");
    divTop.classList.add("obstacle");

    document.body.appendChild(divBot);
    document.body.appendChild(divTop);
}

function moveObstacles() {
    var nextPosition;
    var obstacles = document.getElementsByClassName("obstacle");
    for (var i = 0; i < obstacles.length; i++) {
        nextPosition = parseInt(obstacles[i].style["margin-left"]) - obstacleSpeed;
        if (nextPosition < 0) {
            obstacles[i].parentNode.removeChild(obstacles[i]);
        } else {
            obstacles[i].style["margin-left"] = nextPosition + "px";
        }
    }
}

/*----------------- BIRD -------------- */

var birdDiv = document.getElementById("bird");

function Bird() {
    this.speedY = 0.0;
    this.positionY = 0.0;
    this.positionX = 100; //easier access than over css. It's equal to margin
}

Bird.prototype.jump = function () {
    this.speedY = -10.0;
};

var bird = new Bird(); //could have been made with a singleton but doesn't matter all that much.

/*----------------- WORLD -------------- */
var gravity = 0.5;

//Returns true if the two given rectangles intersect
//NOTE: might be worth testing with clientOffsets instead of 'boundClientRect'.
function intersectRect(r1, r2) {
    return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top);
}

function checkCollission() {
    var collided = false;
    var rectBird = birdDiv.getBoundingClientRect();
    var obstacles = document.getElementsByClassName("obstacle");
    for (var i = 0; i < obstacles.length; i++) {
        collided = intersectRect(rectBird, obstacles[i].getBoundingClientRect());
        if (collided) {
            clearInterval(intervalId);
            alert("You lost.");
        }
    }
}

function updateStats() {
    bird.speedY += gravity;
    bird.positionY += bird.speedY;

    //Don't go over the top
    bird.positionY = 0 > bird.positionY ? 0 : bird.positionY;
    //Don't fall through the ground
    bird.positionY = Math.min(bird.positionY, 380);
    birdDiv.style["margin-top"] = bird.positionY + "px";

    //Don't let gravity stack speed when on ground
    if (bird.positionY === 380) {
        bird.speedY = 0;
    }
}

function initGameLoop() {
    intervalId = setInterval(function () {
        updateStats();
        obstacleSpawnCounter++;
        obstacleSpawnCounter = obstacleSpawnCounter % obstacleSpawnRate;
        if (obstacleSpawnCounter === 0) {
            createObstacle();
        }
        moveObstacles();
        checkCollission();
    }, framerate);
}

function setup() {
    initGameLoop();
}

document.addEventListener('DOMContentLoaded', setup, false);
document.onkeydown = function (e) {
    e = e || window.event;
    var charCode = e.keyCode;
    if (charCode === 32) { //if space
        bird.jump();
    }
};