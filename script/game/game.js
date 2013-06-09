/* This file links to the other files, and contains some global utility functions
and constants */
includeJS("./script/game/vector2.js");
includeJS("./settings.json");
includeJS("./script/game/language.json");
includeJS("./script/game/waves.json");
includeJS("./script/game/audio.js");
includeJS("./script/game/enemycontroller.js");
includeJS("./script/game/heimeidendrawables.js");
includeJS("./script/game/gui.js");
includeJS("./script/game/heimeiden.js");

/* object used to preload images */
_preloadObject = Model.Drawables.SpriteDrawable.clone();
_preloadObject.extend({
    sources : [], /* sources of images to be preloaded */
    currentSource : 0, /* source currently being loaded */
    /* adds src to list of sources to preload */
    add : function(src) {
        this.sources[this.sources.length] = src;
    },
    /* called whenever a source has been loaded successfully */
    onload : function() {
        _preloadObject.nextSource(); /* not this because of
                                        old SpriteDrawable workaround */
    },
    /* goes to load the next source if available */
    nextSource : function() {
        if (this.currentSource < this.sources.length-1) {
            this.currentSource++;
            this.load(this.sources[this.currentSource]);
        }
    },
    /* starts the preloading process */
    loadAll : function() {
        this.load(this.sources[0]);
    }
});

/* sets an image to be preloaded */
preload = function(src) {
    _preloadObject.add(src);
}

/* starts preloading process */
startPreload = function() {
    _preloadObject.loadAll();
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

/* loads json file and returns it parsed as an object */
loadJSON = function(filepath) {
    return JSON.parse(Model.getLocalTextFile(filepath));
}

/* constants for actor movement directions */
const LEFT = -1;
const RIGHT = 1;
const NONE = 0;

/* collision tags */
const collisionDefault = 0;
const collisionEnemy = 1;
const collisionDefence = 2;
const collisionPlatform = 3;
const collisionBullet = 4;
const collisionShell = 5;
const collisionStone = 6;

/* used for final count down when it is not active */
const INACTIVE = -1000;
