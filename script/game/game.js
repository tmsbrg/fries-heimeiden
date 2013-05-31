/* This file links to the other files, and contains some global utility functions
and constants */
includeJS("./script/game/language.json");
includeJS("./settings.json");
includeJS("./script/game/waves.json");
includeJS("./script/game/audio.js");
includeJS("./script/game/enemycontroller.js");
includeJS("./script/game/heimeidendrawables.js");
includeJS("./script/game/gui.js");
includeJS("./script/game/heimeiden.js");

// function for easily generating objects with x and y co-ordinates
vec2 = function (givenx, giveny) {
    return {x:givenx,y:giveny};
}

vec2sum = function (a, b) {
    if (typeof b == "number") {
        return vec2(a.x + b, a.y + b);
    } else {
        return vec2(a.x + b.x, a.y + b.y);
    }
}

vec2divide = function (a, b) {
    if (typeof b == "number") {
        return vec2(a.x / b, a.y / b);
    } else {
        return vec2(a.x / b.x, a.x / b.x);
    }
}

vec2multiply = function (a, b) {
    if (typeof b == "number") {
        return vec2(a.x * b, a.y * b);
    } else {
        return vec2(a.x * b.x, a.x * b.x);
    }
}

// no arguments given: returns random float between 0 and 1
// only max given: returns random int between 0 and max
// min and max given: returns random int between min and max
random = function(max, min) {
    if (max == null) {
        return Math.random();
    } else if (min == null) {
        min = 0;
    }
    return Math.round(Math.random() * (max - min) + min);
}

// linear interpolation
lerp = function(v1, v2, t) {
    return v1+(v2-v1)*t;
}

// true if v1 and v2 are within the distance d
inRange = function(v1, v2, d) {
    return v1 - d > v2 && v1 + d < v2;
}

// loads json file and returns it parsed as an object
loadJSON = function(filepath) {
    return JSON.parse(Model.getLocalTextFile(filepath));
}

// constants for actor movement directions
const LEFT = -1;
const RIGHT = 1;
const NONE = 0;

// collision tags
const collisionDefault = 0;
const collisionEnemy = 1;
const collisionDefence = 2;
const collisionPlatform = 3;
const collisionBullet = 4;
const collisionShell = 5;
const collisionStone = 6;

const INACTIVE = -1000;
