/* This file links to the other files, and contains some global utility functions
and constants */
includeJS("./script/game/language.json");
includeJS("./settings.json");
includeJS("./script/game/waves.json");
includeJS("./script/game/enemycontroller.js");
includeJS("./script/game/heimeiden.js");
includeJS("./script/game/heimeidendrawables.js");

// function for easily generating objects with x and y co-ordinates
vec2 = function (givenx, giveny) {
    return {x:givenx,y:giveny};
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

// constants for actor movement directions
const LEFT = -1;
const RIGHT = 1;
const NONE = 0;
