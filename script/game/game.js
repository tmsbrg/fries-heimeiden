/* This file links to toe other files, and contains some global utility functions
and constants */
includeJS("./script/game/language.json");
includeJS("./script/game/settings.json");
includeJS("./script/game/heimeiden.js");
includeJS("./script/game/heimeidendrawables.js");

foreach = function(array, func, caller) {
    if (caller == null) {
        caller = this;
    }
    for (i = 0; i < array.length; i++) {
        func(array[i], i, caller);
    }
}

vec2 = function (givenx, giveny) {
    return {x:givenx,y:giveny};
}

const LEFT = -1;
const RIGHT = 1;
const NONE = 0;
