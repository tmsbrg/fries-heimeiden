/* This file links to the other files, and contains some global utility functions */

/* these files have no inclusion dependencies */
includeJS("./script/replaceall.js");
includeJS("./script/game/vector2.js");
includeJS("./script/game/audio.js");
includeJS("./script/game/popup.js");
includeJS("./script/game/preload.js");
includeJS("./script/game/getjson.js");
includeJS("./settings.json");

/* these files depend on settings.json */
includeJS("./script/game/constants.js");
includeJS("./script/game/playerdata.js");
includeJS("./script/game/enemycontroller.js");
includeJS("./script/game/gui.js");
includeJS("./script/game/heimeidendrawables.js");

/* these files depend on settings.json and heimeidendrawables.js */
includeJS("./waves.json");
includeJS("./script/game/heimeiden.js");

/* Called by rendering engine when everything is loaded */
initialize = function() {
        Game.initialize();
}

/* random function to be used in the game, if no arguments are given, it 
   does same as standard random function. Otherwise, it returns an int between
   max and (optionally) min */
random = function(max, min) {
    if (max == null) {
        return Math.random();
    } else if (min == null) {
        min = 0;
    }
    return Math.round(Math.random() * (max - min) + min);
}

/* linear interpolation */
lerp = function(v1, v2, t) {
    return v1+(v2-v1)*t;
}

/* returns true if v1 and v2 are within the distance d */
inRange = function(v1, v2, d) {
    return v1 - d < v2 && v1 + d > v2;
}
