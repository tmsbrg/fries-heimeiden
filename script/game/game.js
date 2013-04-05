/* This file links to toe other files, and contains some global utility functions
and constants */
includeJS("./script/game/language.json");
includeJS("./script/game/settings.json");
includeJS("./script/game/heimeiden.js");
includeJS("./script/game/heimeidendrawables.js");

vec2 = function (givenx, giveny) {
    return {x:givenx,y:giveny};
}

const LEFT = -1;
const RIGHT = 1;
const NONE = 0;
