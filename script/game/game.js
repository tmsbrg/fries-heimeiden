/* This file links to the other files, and contains some global utility functions */

/* copyright qwerty,
source: http://dumpsite.com/forum/index.php?PHPSESSID=tn6u7iqbnavoqummsr9om2cjg6&topic=4.msg29#msg29
*/

String.prototype.replaceAll = function(str1, str2, ignore) 
{
	return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};
/* object oriented 2D vector implementation */

vec2 = function (arg1, arg2) {
    var x, y;
    if (typeof arg1 == "object" && arg1 instanceof vec2) {
        x = arg1.x;
        y = arg1.y;
    } else if (arg1 == null || typeof arg1 == "number") {
        if (arg1 == null) arg1 = 0;
        if (arg2 == null) arg2 = 0;
        x = arg1;
        y = arg2;
    } else {
        console.log("vec2 error: " + arg1 + " is not a number or other vec2");
    }
    this.x = x;
    this.y = y;
}

// returns the values of the vec2 as a human-readable string
vec2.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
}

// adds the numbers of the vec2 object with other vec2 objects or with numbers and returns it
vec2.prototype.add = function() {
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        switch (typeof arguments[i]) {
            case "number":
                this.x += arguments[i];
                this.y += arguments[i];
                break;
            case "object":
                if (arguments[i] instanceof vec2) {
                    this.x += arguments[i].x;
                    this.y += arguments[i].y;
                    break;
                }
            default:
                console.log("vec2 error: cannot add '" + arguments[i] + "', is not a number or other vec2 object");
        }
    }
    return this;
}

// substracts other vec2 objects or scalars from the vec2 object and returns it
vec2.prototype.substract = function() {
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        switch (typeof arguments[i]) {
            case "number":
                this.x -= arguments[i];
                this.y -= arguments[i];
                break;
            case "object":
                if (arguments[i] instanceof vec2) {
                    this.x -= arguments[i].x;
                    this.y -= arguments[i].y;
                    break;
                }
            default:
                console.log("vec2 error: cannot substract '" + arguments[i] + "', is not a number or other vec2 object");
        }
    }
    return this;
}

// multiplies the vec2 object with scalar values and returns it
vec2.prototype.multiply = function() {
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        switch (typeof arguments[i]) {
            case "number":
                this.x *= arguments[i];
                this.y *= arguments[i];
                break;
            default:
                console.log("vec2 error: cannot multiply with '" + arguments[i] + "', is not a number");
        }
    }
    return this;
}

// divides the vec2 object with scalar values and returns it
vec2.prototype.divide = function() {
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        switch (typeof arguments[i]) {
            case "number":
                this.x /= arguments[i];
                this.y /= arguments[i];
                break;
            default:
                console.log("vec2 error: cannot divide by '" + arguments[i] + "', is not a number");
        }
    }
    return this;
}
// Plays and manages audio
AudioPlayer = {
    audioList : new Array, // list of audio elements
    paused : false, // whether the current audio is paused or not
    currentAudio : null, // index number of current audio element
    /* Loads one or more files and puts them in its audio list.
    Files are given by relative filepath */
    load : function() {
        len = arguments.length;
        for (var i = 0; i < len; i++) {
            if (typeof arguments[i] === 'string') {
                var audio = document.createElement('audio');
                audio.setAttribute('src', arguments[i]);
                this.audioList[this.audioList.length] = audio;
            } else if (typeof arguments[i] === 'object') { // assume array
                var jlen = arguments[i].length;
                for (var j = 0; j < jlen; j++) {
                    this.load(arguments[i][j]);
                }
            } else {
                console.log("AudioPlayer Error: argument " + arguments[i] +
                            " is not a string or array");
            }
        }
    },
    /* Plays audio at index number number, Loops if loop is set to true.
    If no index number is given, it works as if 0 was given. */
    play : function(number, loop) {
        if (number==null) number = 0;
        if (number >= 0 && number < this.audioList.length) {
            if (this.currentAudio != null) {
                this.stop();
            }
            this.reset();
            this.currentAudio = number;
            if (loop == true) {
                this.startLoop();
            } else if (this.audioList[number].hasAttribute('loop')) {
                this.endLoop();
            }
            this.audioList[number].play();
        } else {
            console.log("AudioPlayer Error: cannot play audio " + number + ", does not exist");
            return 1;
        }
    },
    /* Makes the current audio start from the beginning */
    restart : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].currentTime = 0;
    },
    /* Resets AudioPlayer variables, for when the current audio is stopped */
    reset : function() {
        this.paused = false;
    },
    /* Pauses the current audio */
    pause : function() {
        if (this.currentAudio == null) return;
        this.paused = true;
        this.audioList[this.currentAudio].pause();
    },
    /* Unpauses the current audio */
    unpause : function() {
        if (this.currentAudio == null) return;
        this.paused = false;
        this.audioList[this.currentAudio].play();
    },
    /* Stops the current audio and unselects it */
    stop : function() {
        if (this.currentAudio == null) return;
        this.pause();
        this.restart();
        this.currentAudio = null;
    },
    /* Mutes the current audio */
    mute : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].muted = true;
    },
    /* Unmutes the current audio */
    unmute : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].muted = false;
    },
    /* Makes the current audio into a loop */
    startLoop : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].setAttribute('loop', 'loop');
    },
    /* Removes the loop property from the current audio */
    endLoop : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].removeAttribute('loop');
    }
}
/* Draws fading text popup at given position, with given color.
   Color defaults to yellow */
popupText = function(position, text, color) {
    if (color == null) {
        color = "#FEF500";
    }
    var popupText = Model.Drawables.TextDrawable.clone();
    popupText.font = "normal 48px US_Sans";
    popupText.color = color;
    popupText.ignoremouse = true;
    popupText.setText(text);
    popupText.timeout = settings.popupTimeout;
    popupText.timeleft = settings.popupTimeout;
    popupText.speed = settings.popupSpeed;
    popupText.position = new vec2(position.x - popupText.size.x / 2, position.y);
    popupText.update = function() {
        if (PlayerData.paused) return;
        this.position.y -= this.speed * deltaTime;
        this.timeleft -= deltaTime;
        this.alpha = this.timeleft / this.timeout;
        if (this.timeleft <= 0) {
            Game.removeDrawable(this);
        }
    }
    Game.Popups[Game.Popups.length] = popupText;
    Game.addDrawable(popupText);
}

/* Draws fading and expanding rect popup at given position,
   and color, expanding until given size */
popupRect = function(position, size, color) {
    var rect = Model.Drawables.RectangleDrawable.clone();
    rect.startPosition = position.clone();
    rect.endSize = size.clone();
    rect.color = color;
    rect.timeout = settings.popupRectTimeout;
    rect.timeleft = rect.timeout;
    rect.update = function() {
        if (PlayerData.paused) return;
        this.timeleft -= deltaTime;
        this.alpha = this.timeleft / this.timeout;
        this.size = new vec2((1 - this.timeleft / this.timeout) * this.endSize.x,
                         (1 - this.timeleft / this.timeout) * this.endSize.y);
        this.position = new vec2(this.startPosition.x -
                (this.size.x-this.endSize.x) / 2,
                this.startPosition.y - (this.size.y-this.endSize.y) / 2);
        if (this.timeleft <= 0) {
            Game.removeDrawable(this);
        }
    }
    Game.Popups[Game.Popups.length] = rect;
    Game.addDrawable(rect);
}

/* Draws fading and expanding image popup at given position,
   and with given image, expanding until given size */
popupImage = function(position, size, image, timeoutSpeed, grow) {
    if (timeoutSpeed == null) timeoutSpeed = settings.popupRectTimeout;
    if (grow == null) grow = true;
    var sprite = Model.Drawables.SpriteDrawable.clone();
    sprite.startPosition = position.clone();
    sprite.endSize = size.clone();
    sprite.ignoremouse = true;
    sprite.size = size.clone();
    sprite.load(image);
    sprite.timeout = timeoutSpeed;
    sprite.timeleft = sprite.timeout;
    sprite.grow = grow;
    sprite.update = function() {
        if (PlayerData.paused) return;
        this.timeleft -= deltaTime;
        this.alpha = this.timeleft / this.timeout;
        if (this.grow) {
            this.size = new vec2((1 - this.timeleft / this.timeout) * this.endSize.x,
                             (1 - this.timeleft / this.timeout) * this.endSize.y);
        }
        this.position = new vec2(this.startPosition.x -
                (this.size.x-this.endSize.x) / 2,
                this.startPosition.y - (this.size.y-this.endSize.y) / 2);
        if (this.timeleft <= 0) {
            Game.Popups
            Game.removeDrawable(this);
        }
    }
    Game.Popups[Game.Popups.length] = sprite;
    Game.addDrawable(sprite);
}

/* sets an image to be preloaded */
preload = function(src) {
    _preloadObject.add(src);
}

/* starts preloading process */
startPreload = function() {
    _preloadObject.loadAll();
}

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

/* object to contain already loaded and parsed json files */
jsons = {};

/* loads json file if it hasn't been loaded before, or returns a preloaded object */
getJSON = function(filepath) {
    var editedpath = filepath.replaceAll(".", "").replaceAll("/", "_");
    if (jsons[editedpath]) {
        return jsons[editedpath];
    }
    return jsons[editedpath] = loadJSON(filepath);
}

/* loads json file and returns it parsed as an object */
loadJSON = function(filepath) {
    return JSON.parse(Model.getLocalTextFile(filepath));
}

// pseudo-JSON, because we need comments!

var settings = {

    // graphical settings
        "fieldPosition" : {"x":224, "y":96}, // Do not modify!
        "tileSize" : {"x":212, "y":246}, // Do not modify!
        // FPS
        "showFPS" : false,
        "maxFPS" : 40,
        // for popup texts like "+2"
            "popupSpeed" : 50,
            "popupTimeout" : 2,
        // popuprect, unused
            "popupRectTimeout" : 0.5,
        // actor sizes, 1 is the size of one tile
            "bulletSize" : 0.25,
            "shellSize" : {
                "x" : 0.6,
                "y" : 0.2414634
            },
            "paalwormSize" : {
                "x" : 0.8,
                "y" : 0.8
            },
            "defenseSize" : {
                "x" : 0.85,
                "y" : 0.85
            },
        // layers
            "wavesLayer" : 0,
            "fishLayer" : 1,
            "backgroundImageLayer" : 2,
            "groundLayer" : 3,
            "backCharacterLayer" : 4,
            "dykeLayer" : 5,
            "shoreLayer" : 6,
            "characterLayer" : 7,
            "bulletLayer" : 8,
            "shellLayer" : 9,
            "effectLayer" : 10,
        // water effects
            "waveSpeed" : Math.PI / 8, // in radians per second

            "fishSpawnRate" : {"min" : 5, "max" : 15}, // in seconds
            "fishMoveDistance" : 300, // in pixels
            "fishSpeed" : 0.01, // used in lerp
            "fishMaxAlpha" : 1,
        // gui
            "menuMoveSpeed" : 0.2,
            "showInstructions" : true,
            "instructionTextTime" : 14,
        // sound
            "backgroundMusic" : true,
            "backgroundLoopInterval" : {"min" : 160, "max" : 320}, // seconds until
                                                                   // music restart

    // game settings
        // input
            "deselectIconAfterBuild" : false,
            "canDeselectBuilding" : false,
        // credits
            "startingCredits" : 12,
            "secondsToCreditUpdate" : 4,
            "creditsPerCreditUpdate" : 2,
            "sellRate" : 0.5, // the part of the money returned after selling a
                              // defence
        // field
            "tilesPerLane" : 8, // do not modify!
            "lanes" : 4, // do not modify!
        // enemies
            "weakPaalwormHealth" : 8,
            "weakPaalwormDamage" : 2,

            "strongPaalwormHealth" : 20,
            "strongPaalwormDamage" : 2,

            "paalwormSpeed" : 1,
            "paalwormCooldown" : 1.5, // amount of seconds of cooldown after biting
            "paalwormAttritionTime" : 1000, // time until automatic damage
            "paalwormAttritionAmount" : 0, // amount of automatic damage taken
        // defences
            "defenceBuildCost" : 6,
            "defenceRange" : 10, // range for attacking enemies, in number of tiles
            "defenceCooldown" : 3, // in seconds
            "defenceBuffedCooldown" : 3, // in seconds

            "platformBuildCost" : 8,
            "platformHealth" : 4,

            "stoneBuldCost" : 6,
            "stoneHealth" : 16,

            "priestBuildCost" : 20,
        // dyke
            "dykeHealth" : 20,
        // bullets
            "bulletSpeed" : 1.2,
            "bulletDamage" : 2,
            "bulletBuffedDamage" : 4,
        // shipworm shells
            "weakShellWorth" : 2,
            "strongShellWorth" : 3,
            "shellFadeTime" : 3,
        // waves, default values can be overwritten for specific waves in waves.json
            "defaultMaxEnemies" : 5, // max enemies on screen at the same time
            "defaultSpawnInterval" : {"min":2, "max":5}, // in seconds
            "defaultWaitBeforeWave" : 2, // in seconds,
            "defaultUnlockBuildings" : [], // buildings to try to unlock every wave
                                           // prefer to keep empty
        // end of game
            "timeUntilFreeze" : 3 // seconds until game freezes and
                                  // final screen pops up
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

/* calculated from settings */
const FIELD_SIZE = settings.tileSize.x * settings.tilesPerLane;

/* set max FPS, done here so that we know settings have loaded and View has not
been initialized yet */
View.fps = settings.maxFPS;
/* Contains player data to be reset on every play*/
PlayerData = {
    paused : null,
    credits : null,
    endOfGame : null,
    creditsTimer : null,
    selectedBuilding : null,
    audioEnabled : null,
    areWavesFinished : null,
    selectedBuilding : null,
    canBuild : null,
    finalCountDown : null,
    timeUntilNextFish : null,
    currentFishId : null,
    lost : null,
    giveCredits : null,
    timeUntilRestartMusic : null,
    /* called when the game gets started, sets all playerdata to initial values */
    reset : function() {
        this.paused = false;
        this.credits = settings.startingCredits;
        this.endOfGame = false;
        this.creditsTimer = 0;
        this.selectedBuilding = null;
        this.audioEnabled = true;
        this.areWavesFinished = false;
        this.selectedBuilding = null;
        this.canBuild = true;
        this.finalCountDown = INACTIVE;
        this.timeUntilNextFish = settings.fishSpawnRate.max;
        this.currentFishId = 0;
        this.lost = false;
        this.giveCredits = true;
        this.timeUntilRestartMusic = 0;
    }
};

/* Manages the enemies on the field according to waves defined in waves.json */
EnemyController = Model.Drawables.BaseDrawable.clone();
EnemyController.extend({
    active : false,
    currentWave : 0,
    currentSubWave : 0,
    inWave : false,
    subWaves : null,
    maxEnemies : null,
    spawnInterval : null,
    waitBeforeWave : null,
    enemyPool : null,
    lastLane : null,
    spawnTimer : 0,
    waitTimer : 0,
    onDrawInit : function() {
        this.setNewWaveInfo();
    },
    /* check if in a wave and if so, call updateWave(), otherwise count down
       until the wave should start and start it */
    update : function() {
        if (PlayerData.paused || !PlayerData.enemiesSpawn) return;
        if (this.inWave) {
            this.updateWave();
        } else {
            this.waitTimer += deltaTime;
            if (this.waitTimer > this.waitBeforeWave) {
                this.waitTimer = 0;
                this.startWave();
            }
        }
    },
    /* takes enemies from the current pool and spawns them, and checks to go to the
       next subwave or wave */
    updateWave : function() {
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            this.spawnTimer = random(this.spawnInterval.max,
                                     this.spawnInterval.min);
            var enemiesOnField = this.parent.countActors(collisionEnemy);
            if (enemiesOnField < this.maxEnemies) {
                var enemyToSpawn = this.getEnemyFromPool();
                if (enemyToSpawn != -1) {
                    var lane;
                    do {
                        lane = random(settings.lanes-1);
                    } while (this.lastLane == lane);
                    this.parent.spawnEnemy(lane, enemyToSpawn);
                    this.enemyPool[enemyToSpawn]--;
                    this.lastLane = lane;
                } else {
                    this.currentSubWave++;
                    if (this.currentSubWave >= this.subWaves.length) {
                        if (enemiesOnField == 0) {
                            this.currentSubWave = 0;
                            this.endWave();
                        }
                    } else {
                        this.startSubWave();
                    }
                }
            }
        }
    },
    /* returns a random active enemy type from the pool */
    getEnemyFromPool : function() {
        var activeEnemyTypes = this.getNumberOfActiveEnemyTypes();
        if (activeEnemyTypes == 0) {
            return -1; // No enemies in pool
        }
        var enemy = random(activeEnemyTypes-1);
        return this.getActiveEnemy(enemy);
    },
    /* returns the number of enemy types in the pool that are not empty */
    getNumberOfActiveEnemyTypes : function() {
        var result = 0;
        for (var i = this.enemyPool.length-1; i > -1; i--) {
            if (this.enemyPool[i] > 0) {
                result++;
            }
        }
        return result;
    },
    /* returns the enemy at index given by number, but ignoring inactive enemies */
    getActiveEnemy : function(number) {
        var len = this.enemyPool.length;
        for (var i = 0; i < len; i++) {
            if (this.enemyPool[i] > 0) {
                if (number == 0) {
                    return i;
                }
                number--;
            }
        }
        console.log("EnemyController Error: Cannot find Active Enemy " + number);
        return -1;
    },
    /* starts current wave */
    startWave : function() {
        this.startSubWave();
        this.inWave = true;
    },
    /* ends current wave and loads info for next wave, or stops if there are no
       more waves */
    endWave : function() {
        this.inWave = false;
        this.spawnTimer = 0;
        this.currentWave++;
        GUI.newWave();
        if (this.currentWave < Waves.waves.length) {
            this.setNewWaveInfo();
            this.unlockDefences();
        } else {
            this.stop();
        }
    },
    /* unlocks defences given by wave */
    unlockDefences : function() {
        for (var i = this.unlockBuildings.length-1; i > -1; i--) {
            GUI.unlockBuilding(this.unlockBuildings[i]);
        }
    },
    /* loads the current subwave's enemy pool */
    startSubWave : function() {
        this.enemyPool = this.subWaves[this.currentSubWave].enemies.clone();
    },
    /* loads wave information for current wave */
    setNewWaveInfo : function() {
        this.setWaveVariable("maxEnemies");
        this.setWaveVariable("spawnInterval");
        this.setWaveVariable("waitBeforeWave");
        this.setWaveVariable("subWaves");
        this.setWaveVariable("unlockBuildings");
    },
    /* sets a wave variable according to the rule defined for the current wave,
    or, if no rule is defined, take it from the defaults in settings.json */
    setWaveVariable : function(variable) {
        this[variable] = (Waves.waves[this.currentWave][variable] != null) ?
                            Waves.waves[this.currentWave][variable] :
                            settings["default" + variable.charAt(0).toUpperCase()
                                     + variable.substr(1)];
    },
    start : function() {
        this.active = true;
        this.unlockDefences();
    },
    stop : function() {
        this.active = false;
        this.parent.wavesFinished();
    },
    reset : function() {
        this.inWave = false;
        this.lastLane = null;
        this.spawnTimer = 0;
        this.waitTimer = 0;
        this.currentWave = 0;
        this.currentSubWave = 0;
        this.setNewWaveInfo();
    }
});

/* Button used to select what to build */
BuildingSelectButton = Model.Drawables.ButtonDrawable.clone()
BuildingSelectButton.extend({
    visible : false,
    building : null, /* building object bound to this button */
    baseImage : null, /* part of image path from which to get the unselected
                         version of the image and the selected version */
    lockedImage : "./images/gui/icons/lock.png",
    costText : null,
    locked : true,
    selected : false,
    grey : false,
    size : new vec2(170,170),

    /* initialize cost text, assume building is already given */
    onDrawInit : function() {
        if (this.building != RemoveDefence) {
            this.costText = Model.Drawables.TextDrawable.clone();
            this.costText.size = new vec2(50, 20);
            this.costText.position = new vec2(40,
                                              this.size.y - 30);
            this.costText.font = "bold 52px US_Sans";
            this.costText.color = "#FEF500";
            this.costText.borderWidth = 2;
            this.costText.borderColor = 'black';
            this.costText.setText("F " + this.building.cost + ".-");
            this.addDrawable(this.costText);
        }
    },
    /* deselect any other selected building and select ours */
    onmousedown : function() {
        if (!PlayerData.paused && !this.locked) {
            if (PlayerData.selectedBuilding != this.building) {
                GUI.deselectBuilding();
                PlayerData.selectedBuilding = this.building;
                this.selected = true;
                this.updateImage();
            } else if (settings.canDeselectBuilding) {
                GUI.deselectBuilding();
                this.selected = false;
                this.updateImage();
            }
        }
    },
    /* load a baseImage and set current image to the unselected version */
    loadBase : function(src) {
        this.baseImage = src;
        this.updateImage();
    },
    /* show the unselected version of the image */
    deselect : function() {
        if (this.selected) {
            this.selected = false;
            this.updateImage();
        }
    },
    /* update image to use */
    updateImage : function() {
        if (!this.locked) {
            this.load(this.baseImage +
                        (this.selected? "_selected" : "") +
                        (this.grey? "_grey" : "") +
                        ".png");
        } else {
            this.load(this.lockedImage);
        }
    },
    /* check if the player has enough money and update image accordingly */
    update : function() {
        if (this.building.cost > PlayerData.credits) {
            if (!this.grey) {
                this.grey = true;
                this.updateImage();
            }
        } else {
            if (this.grey) {
                this.grey = false;
                this.updateImage();
            }
        }
    },
    /* unlocks the button */
    unlock : function() {
        this.locked = false;
        this.parent.triggerInstructions(this);
        this.updateImage();
    },
    /* locks the button */
    lock : function () {
        this.locked = true;
        this.updateImage();
    }
});

/* GUIButton is used for all buttons in the GUI that have a special onhover
   version */
GUIButton = Model.Drawables.ButtonDrawable.clone();
GUIButton.extend({
    basepath : "",
    setBasepath : function(basepath) {
        this.basepath = basepath;
        this.reset();
    },
    onhover : function() {
        this.load(this.basepath + "_selected.png");
    },
    onmouseout : function() {
        this.reset();
    },
    reset : function() {
        this.load(this.basepath + ".png");
    }
});

/* The button that starts the game */
StartButton = GUIButton.clone();
StartButton.extend({
    basepath : "./images/gui/playbutton",
    onDrawInit : function() {
        this.onmouseout();
    },
    onclick : function() {
        this.parent.gameStart();
    },
});

/* a piece of instructions for one game element */
InstructionText = Model.Drawables.SpriteDrawable.clone();
InstructionText.extend({
    active : false,
    visible : false,
    cursor : "pointer",
    instructionImage : "",
    timeUntilHide : 0,
    update : function() {
        if (PlayerData.paused) return;
        this.timeUntilHide -= deltaTime;
        if (PlayerData.giveCredits) {
            PlayerData.giveCredits = false;
        }
        if (PlayerData.canBuild) {
            PlayerData.canBuild = false;
        }
        if (PlayerData.enemiesSpawn) {
            PlayerData.enemiesSpawn = false;
        }
        if (this.timeUntilHide <= 0) {
            this.close();
        }
    },
    preload : function() {
        preload(this.instructionImage);
    },
    hide : function() {
        if (!PlayerData.giveCredits) {
            PlayerData.giveCredits = true;
        }
        if (!PlayerData.canBuild) {
            PlayerData.canBuild = true;
        }
        if (!PlayerData.enemiesSpawn) {
            PlayerData.enemiesSpawn = true;
        }
        this.active = false;
        this.visible = false;
    },
    show : function() {
        this.timeUntilHide = settings.instructionTextTime;
        this.active = true;
        this.visible = true;
        this.size.x = this._image.width;
        this.size.y = this._image.height;
    },
    close : function() {
        GUI.triggerInstructions(this);
        this.hide();
    },
    onmousedown : function() {
        GUI.nextInstructionTexts();
    }
});

/* Contains a number of pages of instructions for the player */
InstructionScreen = Model.Drawables.BaseDrawable.clone();
InstructionScreen.extend({
    size : new vec2(1123, 842),
    /* array of instruction screens */
    screens : ["./images/gui/instructions/0.png",
        "./images/gui/instructions/1.png",
        "./images/gui/instructions/2.png",
        "./images/gui/instructions/3.png"],
    screenObject : Model.Drawables.SpriteDrawable.clone(), /* object used to draw
                                                              the current page */
    previousButton : GUIButton.clone(),
    nextButton : GUIButton.clone(),
    closeButton : GUIButton.clone(),
    onDrawInit : function() {
        this.position = new vec2(1920, 1080).add(
            new vec2(settings.fieldPosition.x, 0));
        this.position.divide(2);
        this.position.substract(new vec2(this.size).divide(2));

        this.screenObject.size = this.size;
        this.addDrawable(this.screenObject);

        this.previousButton.setBasepath("./images/gui/instructions/previous");
        this.previousButton.size = new vec2(430, 110);
        this.previousButton.position = new vec2(0, 842 - this.previousButton.size.y);
        this.previousButton.onclick = function() {
            this.parent.previousScreen();
        }
        this.addDrawable(this.previousButton);

        this.nextButton.setBasepath("./images/gui/instructions/next");
        this.nextButton.size = new vec2(430, 110);
        this.nextButton.position = new vec2(this.size).substract(this.nextButton.size);
        this.nextButton.onclick = function() {
            this.parent.nextScreen();
        }
        this.addDrawable(this.nextButton);

        this.closeButton.setBasepath("./images/gui/instructions/exit");
        this.closeButton.size = new vec2(430, 110);
        this.closeButton.position = new vec2(this.size.y - this.closeButton.size.y,
                                             0);
        this.closeButton.onclick = function() {
            this.parent.close();
        }
        this.addDrawable(this.closeButton);

        this.reset();
    },
    /* loads the instruction screen iamge for the given page number */
    loadScreen : function(number) {
        this.currentScreen = number;
        this.screenObject.load(this.screens[number]);
        if (number == 0) {
            this.previousButton.visible = false;
        } else if (this.previousButton.visible == false) {
            this.previousButton.visible = true;
        }

        if (number == this.screens.length-1) {
            this.nextButton.visible = false;
        } else if (this.nextButton.visible == false) {
            this.nextButton.visible = true;
        }
    },
    /* loads the first screen and makes it invisible */
    reset : function() {
        this.visible = false;
        this.loadScreen(0);
    },
    previousScreen : function() {
        if (this.currentScreen > 0) {
            this.loadScreen(this.currentScreen - 1);
        } else {
            console.log("InstructionScreen: Cannot go to previous screen, already at first screen!");
        }
    },
    nextScreen : function() {
        if (this.currentScreen < this.screens.length-1) {
            this.loadScreen(this.currentScreen + 1);
        } else {
            console.log("InstructionScreen: Cannot go to next screen, already at last screen!");
        }
    },
    show : function() {
        this.visible = true;
    },
    close : function() {
        this.reset();
    },
    toggle : function() {
        if (this.visible) {
            this.close();
        } else {
            this.show();
        }
    }
});

/* the screen shown after the player wins or loses the game */
FinalScreen = Model.Drawables.ButtonDrawable.clone();
FinalScreen.extend({
    size : new vec2(1123, 842),
    winImage : "./images/gui/end/win.png",
    loseImage : "./images/gui/end/lose.png",
    audio : null,
    onDrawInit : function() {
        this.position = new vec2(1920 - settings.fieldPosition.x,
                                 1080 -settings.fieldPosition.y);
        this.position.divide(2);
        this.position.substract(new vec2(this.size).divide(2));
        this.position.add(new vec2(settings.fieldPosition.x,
                                   settings.fieldPosition.y));
        this.audio = AudioPlayer.clone();
        this.audio.load("./audio/lose.ogg", "./audio/win.ogg");
        this.close();
    },
    preload : function() {
        preload(this.winImage);
        preload(this.loseImage);
    },
    show : function() {
        this._image.loaded = false; /* do not accidentally show wrong image before
                                       getting new one */
        if (PlayerData.lost) {
            if (PlayerData.audioEnabled) this.audio.play(0);
            this.load(this.loseImage);
        } else {
            if (PlayerData.audioEnabled) this.audio.play(1);
            this.load(this.winImage);
        }
        this.visible = true;
    },
    close : function() {
        this.visible = false;
    },
    onclick : function() {
        GUI.gameStop();
    }
});

/* The GUI contains all HUD images, texts and buttons, but actually not all of the
   GUI. The side menu and various popup menus were seperated from it because of
   onclick problems */
GUI = Model.Drawables.BaseDrawable.clone();
GUI.extend({
    name : "GUI",
    active : false,
    size : new vec2(1920, 1080),
    buildingSelectButtonY : 123, /* the X value for all buildingSelectButtons */
    buildingSelectButtonX : 23, /* the Y value for the first buildingSelectButton */
    buildingSelectButtonSpace : 19, /* space between each buildingSelectButton */
    buildingSelectButtons : new Array(),

    startscreenGUIElements : new Array(), /* GUI elements to show before the game
                                             begins */
    inGameGUIElements : new Array(), /* GUI elements to show ingame */
    instructions : new Array(), /* Instruction texts */

    startButton : null,

    wavesTextBox : null,
    creditsTextBox : null,
    dykeHealthBox : null,
    fpsTextBox : null,

    menuBar : null, /* reference to the side menu */
    game : null, /* reference to the game */

    /* initializes all GUI stuff, should only be called once per game */
    init : function() {
        this.game = Game;
        this.initSplash();
        Model.addDrawable(this);
        this.initHUD();
        Model.addDrawable(FinalScreen);
    },
    /* initializes splash screen */
    initSplash : function() {
        var splashscreen = Model.Drawables.SpriteDrawable.clone()
        splashscreen.load("./images/gui/splashscreen.png");
        splashscreen.size = new vec2(1920, 1080);
        this.addGUIElement(splashscreen, false);
    },
    /* initializes HUD elements */
    initHUD : function() {
        var sideImage = Model.Drawables.SpriteDrawable.clone();
        sideImage.visible = false;
        sideImage.size = new vec2(224, 1080);
        sideImage.load("./images/gui/hud_left.png");
        this.addGUIElement(sideImage);
        var upImage = Model.Drawables.SpriteDrawable.clone();
        upImage.visible = false;
        upImage.position.x = 222;
        upImage.size = new vec2(1699, 98);
        upImage.load("./images/gui/hud_up.png");
        this.addGUIElement(upImage);

        this.initWavesText();
        this.initCreditsText();
        this.initDykeHealth();
        if (settings.showFPS) {
            this.initFPSText();
        }
        this.initButtons();
        this.initInstructionTexts();
        this.initMenuBar();
    },
    initWavesText : function() {
        this.wavesTextBox = Model.Drawables.TextDrawable.clone();
		this.wavesTextBox.position = new vec2(1635, 28);
		this.wavesTextBox.size = new vec2(400, 20);
		this.wavesTextBox.font = "bold 52px US_Sans";
		this.wavesTextBox.color = "#FE0000";
        this.wavesTextBox.borderWidth = 2;
        this.wavesTextBox.borderColor = 'black';
        this.wavesTextBox.borderWidth = 2;
        this.wavesTextBox.borderColor = 'black';
		this.addGUIElement(this.wavesTextBox);
    },
    initCreditsText : function() {
        this.creditsTextBox = Model.Drawables.TextDrawable.clone();
		this.creditsTextBox.position = { x: 100,
                                         y: 55 };
		this.creditsTextBox.size = new vec2(400, 20);
		this.creditsTextBox.font = "bold 35px US_Sans";
		this.creditsTextBox.color = "#FEF500" ;
        this.creditsTextBox.borderWidth = 2;
        this.creditsTextBox.borderColor = 'black';
		this.addGUIElement(this.creditsTextBox);
    },
    initDykeHealth : function() {
        this.dykeHealthBox = Model.Drawables.TextDrawable.clone();
		this.dykeHealthBox.position = { x: 274,
                                        y: 28 };
		this.dykeHealthBox.size = new vec2(400, 20);
		this.dykeHealthBox.font = "bold 52px US_Sans";
		this.dykeHealthBox.color = "#23F407";
        this.dykeHealthBox.borderWidth = 2;
        this.dykeHealthBox.borderColor = 'black';
		this.addGUIElement(this.dykeHealthBox);
    },
    initFPSText : function() {
        this.fpsTextBox = Model.Drawables.TextDrawable.clone();
		this.fpsTextBox.position = { x: 900,
                                        y: 14 };
		this.fpsTextBox.size = new vec2(400, 20);
		this.fpsTextBox.font = "bold 52px US_Sans";
		this.fpsTextBox.color = "#FE0000";
        this.fpsTextBox.borderWidth = 2;
        this.fpsTextBox.borderColor = 'black';
		this.addGUIElement(this.fpsTextBox);
    },
    /* initializes buttons and adds building select buttons */
    initButtons : function() {
        this.startButton = StartButton;
        this.startButton.size = new vec2(250, 250);
        this.startButton.position = new vec2(
            View.canvasWidth / 2 - this.startButton.size.x / 2,
            View.canvasHeight / 2 - this.startButton.size.y * 0.7); 
        this.addGUIElement(this.startButton, false);
        this.addBuildingSelectButton(ShootingDefence, "./images/gui/icons/heimeid_stone");
        this.addBuildingSelectButton(Platform, "./images/gui/icons/platform");
        this.addBuildingSelectButton(Priest, "./images/gui/icons/priest");
        this.addBuildingSelectButton(Stone, "./images/gui/icons/stone");
        this.addBuildingSelectButton(RemoveDefence, "./images/gui/icons/remove");
    },
    /* initializes side menu, but keeps it seperate from the main GUI class */
    initMenuBar : function() {
        this.menuBar = MenuBar;
        this.menuBar.load("./images/gui/menubar.png");
        this.menuBar.position = {x: 1850, y: 540 - this.menuBar.size.y / 2};
        Model.addDrawable(this.menuBar);

        Model.addDrawable(InstructionScreen);
    },
    /* initializes popup instruction texts */
    initInstructionTexts : function() {
        if (settings.showInstructions == false) return;
        var heimeidInstruction = this.addInstructionText(new vec2(200, 100),
                                new vec2(382, 217),
                                this.getBuildingSelectButton(ShootingDefence),
                                "Heimeid.png");
        var moneyInstruction = this.addInstructionText(new vec2(200, 100),
                                new vec2(342, 355),
                                heimeidInstruction,
                                "Money.png");
        this.addInstructionText(new vec2(200, 290),
                                new vec2(509, 290),
                                this.getBuildingSelectButton(Platform),
                                "Platform.png");
        this.addInstructionText(new vec2(200, 440),
                                new vec2(382, 300),
                                this.getBuildingSelectButton(Priest),
                                "Priest.png");
        this.addInstructionText(new vec2(200, 650),
                                new vec2(382, 217),
                                this.getBuildingSelectButton(Stone),
                                "Stone.png");
        this.addInstructionText(new vec2(200, 780),
                                new vec2(382, 300),
                                this.getBuildingSelectButton(RemoveDefence),
                                "RemoveDefence.png");
        this.addInstructionText(new vec2(1600, 100),
                                new vec2(290, 393),
                                moneyInstruction,
                                "Waves.png");
        this.addInstructionText(new vec2(230, 100),
                                new vec2(290, 393),
                                moneyInstruction,
                                "Health.png");
    },
    /* gets a building select button by the object associated with them */
    getBuildingSelectButton : function(building) {
        for (var i = this.buildingSelectButtons.length-1; i > -1; i--) {
                if (this.buildingSelectButtons[i].building == building) {
                    return this.buildingSelectButtons[i];
                }
        }
    },
    /* adds a button, text or image to draw during the game or before the game
       starts */
    addGUIElement : function(element, ingame) {
        if (ingame == null) ingame = true;
        this.addDrawable(element);
        if (ingame) {
            this.inGameGUIElements[this.inGameGUIElements.length] = element;
        } else {
            this.startscreenGUIElements[this.startscreenGUIElements.length]
                = element;
        }
    },
    /* adds a buildingselectbutton for the given building and with given
       image basepath in the correct position */
    addBuildingSelectButton : function(building, image) {
        button = BuildingSelectButton.clone();
        button.building = building;
        button.loadBase(image);

        var yposition = (this.buildingSelectButtons.length) ? 
         this.buildingSelectButtons[this.buildingSelectButtons.length-1].position.y
           + BuildingSelectButton.size.y + this.buildingSelectButtonSpace
         : this.buildingSelectButtonY;

        button.position = {x: this.buildingSelectButtonX, y: yposition};
        this.addGUIElement(button);
        this.buildingSelectButtons[this.buildingSelectButtons.length] = button;
    },
    /* adds intruction text at given position and size with textImage found in
    ./images/gui/instructions/popup/. Becomes visible when triggered by
    triggerObject. triggerObject can be a building that becomes unlocked or a
    different instructiontext when it hides itself */
    addInstructionText : function(position, size, triggerObject, textImage) {
        var instruction = InstructionText.clone();
        instruction.position = position;
        instruction.size = size;
        instruction.triggerObject = triggerObject;
        instruction.load("./images/gui/instructions/popup/" + textImage);
        Model.addDrawable(instruction);
        this.instructions[this.instructions.length] = instruction;
        return instruction;
    },
    nextInstructionTexts : function() {
        for (var i = this.instructions.length-1; i > -1; i--) {
            if (this.instructions[i].visible) {
                this.instructions[i].close();
            }
        }
    },
    triggerInstructions : function(trigger) {
        for (var i = this.instructions.length-1; i > -1; i--) {
            if (this.instructions[i].triggerObject == trigger) {
                this.instructions[i].show();
            }
        }
    },
    /* deselects currently selected building */
    deselectBuilding : function() {
        PlayerData.selectedBuilding = null;
        for (var i = this.buildingSelectButtons.length-1; i > -1; i--) {
                this.buildingSelectButtons[i].deselect();
        }
    },
    unlockBuilding : function(buildingObject) {
        for (var i = this.buildingSelectButtons.length-1; i > -1; i--) {
                if (this.buildingSelectButtons[i].building === buildingObject) {
                    this.buildingSelectButtons[i].unlock();
                    return;
                }
        }
    },
    /* starts the game */
    gameStart : function() {
        for (var i = this.inGameGUIElements.length-1; i > -1; i--) {
            this.inGameGUIElements[i].visible = true;
        }
        this.game.gameStart();
        this.menuBar.gameStart();
        this.buildingSelectButtons[0].onmousedown();
        this.menuStop();
        for (var i = this.instructions.length-1; i > -1; i--) {
            if (this.instructions[i].triggerObject == null) {
                this.instructions[i].show();
            }
        }
    },
    /* stops the game */
    gameStop : function() {
        for (var i = this.inGameGUIElements.length-1; i > -1; i--) {
            this.inGameGUIElements[i].visible = false;
        }
        for (var i = this.buildingSelectButtons.length-1; i > -1; i--) {
            this.buildingSelectButtons[i].lock();
        }
        for (var i = this.instructions.length-1; i > -1; i--) {
            this.instructions[i].hide();
        }
        this.menuBar.reset();
        InstructionScreen.reset();
        this.game.gameStop();
        this.menuBar.gameStop();
        this.menuStart();
        FinalScreen.close();
    },
    /* starts the menu */
    menuStart : function() {
        this.size.x = 1920;
        for (i = this.startscreenGUIElements.length-1; i > -1; i--) {
            this.startscreenGUIElements[i].visible = true;
        }
    },
    /* stops the menu */
    menuStop : function() {
        this.size.x = 1920 - settings.tileSize.x * settings.tilesPerLane;
        for (i = this.startscreenGUIElements.length-1; i > -1; i--) {
            this.startscreenGUIElements[i].visible = false;
        }
    },
    /* shows the final screen */
    endGame : function() {
        FinalScreen.show();
    },
    /* updates HUD texts every frame */
    update : function() {
        this.wavesTextBox.text = "RONDE " + (EnemyController.currentWave +
            !PlayerData.areWavesFinished) +
            "/" + Waves.waves.length;
        this.creditsTextBox.text = "F " + PlayerData.credits + ",-";
        this.dykeHealthBox.text = "DIJK: " + ((this.game.dyke.health <= 0) ? 0 :
            Math.round((this.game.dyke.health / settings.dykeHealth * 100))) + "%";
        if (settings.showFPS) {
            this.fpsTextBox.text = "FPS: " + View.lastfps;
        }
    },
    newWave : function() {
        //this.wavesTextBox.color = 
    }
});

/* the side menu, which slides open from the right */
MenuBar = Model.Drawables.ButtonDrawable.clone();
MenuBar.extend({
    visible : false,
    restartButton : GUIButton.clone(),
    instructionButton : GUIButton.clone(),
    stopButton : GUIButton.clone(),
    soundButton : GUIButton.clone(),
    size : new vec2(679, 476),
    textPosition : new vec2(83, 15), /* offset where the texts will be drawn */
    textSize : new vec2(386, 72), /* size for all text images */
    originPosition : null,
    destination : null,
    slidedOut : false,
    speed : settings.menuMoveSpeed,
    cursor : "pointer",
    gui : GUI, /* reference to the GUI */
    /* initializes all buttons */
    onDrawInit : function() {
        this.originPosition = this.position.clone();

        this.restartButton.setBasepath("./images/gui/menubar_buttons/restart");
        this.restartButton.size = this.textSize.clone();
        this.restartButton.position = new vec2(this.textPosition.x,
            this.textPosition.y);
        this.addDrawable(this.restartButton);
        this.instructionButton.setBasepath(
            "./images/gui/menubar_buttons/instructions");
        this.instructionButton.size = this.textSize.clone();
        this.instructionButton.position = new vec2(this.textPosition.x,
            this.textPosition.y + this.textSize.y);
        this.addDrawable(this.instructionButton);
        this.stopButton.setBasepath("./images/gui/menubar_buttons/stop");
        this.stopButton.size = this.textSize.clone();
        this.stopButton.position = new vec2(this.textPosition.x,
            this.textPosition.y + this.textSize.y * 2);
        this.addDrawable(this.stopButton);
        this.soundButton.size = new vec2(419, 81);
        this.soundButton.position = new vec2(this.textPosition.x,
            this.textPosition.y + this.textSize.y * 5);
        this.addDrawable(this.soundButton);
        this.soundButton.audioMutedIcon = Model.Drawables.ButtonDrawable.clone();
        this.soundButton.audioMutedIcon.position = new vec2(this.soundButton.size.x,
            -10);
        this.soundButton.audioMutedIcon.load(
            "./images/gui/menubar_buttons/mute.png");
        this.soundButton.audioMutedIcon.size = new vec2(123, 105);
        this.soundButton.addDrawable(this.soundButton.audioMutedIcon);
    },
    /* resets stuff and makes itself visible for when the game starts */
    gameStart : function() {
        this.visible = true;
        this.soundButton.updateBasepath();
    },
    /* makes itself invisible for when the game ends */
    gameStop : function() {
        this.visible = false;
    },
    onclick : function() {
        if (PlayerData.finalCountDown != INACTIVE) return;
        if (this.slidedOut) {
            this.slideIn();
            InstructionScreen.close();
            this.unPause();
            this.slidedOut = false;
        } else {
            this.slideOut();
            this.pause();
            this.slidedOut = true;
        }
    },
    slideOut : function() {
        this.destination = this.originPosition.x - this.size.x * 0.9;
    },
    slideIn : function() {
        this.destination = this.originPosition.x;
    },
    pause : function() {
        if (!PlayerData.endOfGame) {
            PlayerData.paused = true;
        }
    },
    unPause : function() {
        if (!PlayerData.endOfGame) {
            PlayerData.paused = false;
        }
    },
    update : function() {
        if (this.destination != null) {
            this.position.x = lerp(this.position.x, this.destination, this.speed);
            if (inRange(this.position.x, this.destination, 10)) {
                this.position.x = this.destination;
                this.destination = null;
            }
        }
    },
    reset : function() {
        this.destination = null;
        this.slidedOut = false;
        this.position = this.originPosition.clone();
    },
});

MenuBar.stopButton.onclick = function() {
    this.parent.gui.gameStop();
}

MenuBar.restartButton.onclick = function() {
    this.parent.gui.gameStop();
    this.parent.gui.gameStart();
}

MenuBar.soundButton.updateBasepath = function() {
    if (PlayerData.audioEnabled) {
        this.setBasepath("./images/gui/menubar_buttons/sound_on");
        this.audioMutedIcon.visible = false;
    } else {
        this.setBasepath("./images/gui/menubar_buttons/sound_off");
        this.audioMutedIcon.visible = true;
    }
}

MenuBar.soundButton.onclick = function() {
    PlayerData.audioEnabled = !PlayerData.audioEnabled;
    this.updateBasepath();
}

MenuBar.instructionButton.onclick = function() {
    InstructionScreen.toggle();
}
/* creates and maintains an array of tiles for a lane */
Lane = Model.Drawables.BaseDrawable.clone();
Lane.extend({
    size : new vec2(settings.tileSize.x*settings.tilesPerLane, settings.tileSize.y),
    lanePos : 0,
    Tiles : new Array(settings.tilesPerLane),
    /* sets its pixel position based on its lane position */
    setLanePos : function(pos) {
        this.position.y = this.size.y * pos;
        this.lanePos = pos;
    },
    /* initializes tiles */
    onDrawInit : function() {
        for (var i = settings.tilesPerLane-1; i > -1; i--) {
            this.Tiles[i] = Tile.clone();
            this.Tiles[i].position.x += settings.tileSize.x * i;
            this.Tiles[i].tileIndex = i;
            this.addDrawable(this.Tiles[i]);
        }
    },
    /* makes Game create a defence on own y position and given x position */
    buildBuilding : function(xpos, buildingObject) {
        return this.parent.buildBuilding(new vec2(xpos, this.position.y),
            buildingObject);
    },
    /* makes Game create a credits popup on own y position and given x position */
    creditsPopupOnTile : function(xpos, amount, positive) {
        this.parent.creditsPopupOnTile(new vec2(xpos, this.position.y),
                                       amount,
                                       positive);
    },
    /* Creates a 'cannot build' popup on lane at given x position */
    popupCannotBuild : function(xpos) {
        popupImage(new vec2(xpos, this.position.y),
                   settings.tileSize,
                   "./images/gui/cross.png",
                   0.75,
                   false);
    },
    /* resets all tiles */
    reset : function() {
        for (var i = this.Tiles.length-1; i > -1; i--) {
            this.Tiles[i].reset();
        }
    },
    /* gets tile at given index, or null if out of bounds */
    getTile : function(tileIndex) {
        if (tileIndex >= 0 && tileIndex < this.Tiles.length) {
            return this.Tiles[tileIndex];
        } else {
            return null;
        }
    }
});

/* Tile object, handles mouse clicks and building stuff on them */
Tile = Model.Drawables.BaseDrawable.clone();
Tile.extend({
    size : settings.tileSize.clone(),
    tileIndex : null,
    platform : null,
    building : null,
    /* empties the Tile's references to its building and platform */
    reset : function() {
        this.building = null;
        this.platform = null;
    },
    /* handles building on the tile */
    onmousedown : function () {
        if (!PlayerData.paused && PlayerData.selectedBuilding != null) {
            switch (PlayerData.selectedBuilding) {
            case Stone:
                this.buildStone();
                break;
            case Platform:
                this.buildPlatform();
                break;
            case RemoveDefence:
                this.removeDefence();
                break;
            default:
                this.buildDefault();
                break;
            }
        }
    },
    /* checks if a stone can be built here and attempts to build it */
    buildStone : function() {
        if (!this.building && !this.platform && this.tileIndex != 0) {
            this.building = this.parent.buildBuilding(this.position.x,
                PlayerData.selectedBuilding);
            if (this.building) {
                this.building.tile = this;
            }
        } else {
            this.parent.popupCannotBuild(this.position.x);
        }
    },
    /* checks if a platform can be built and attempts to build it */
    buildPlatform : function() {
        if (!this.building && (this.tileIndex == 1 || this.isPlatformLeft()) &&
            this.platform == null) {
            if ((this.platform = this.parent.buildBuilding(this.position.x,
                Platform)) != null) {
                this.platform.tile = this;
                this.platform.builder = this.parent.buildBuilding(this.position.x,
                                                                  BuildHeimeid);
            }
        } else {
            this.parent.popupCannotBuild(this.position.x);
        }
    },
    /* removes building if present, otherwise removes platform if present.
       returns part of the money to the player */
    removeDefence : function() {
        var returnMoney = 0;
        if (this.building) {
            returnMoney = this.building.cost * settings.sellRate;
            this.building.die();
            this.building = null;
        } else if (this.platform) {
            returnMoney = this.platform.cost * settings.sellRate;
            this.platform.die();
            this.reset();
        }

        returnMoney = Math.round(returnMoney);

        if (returnMoney > 0) {
            Game.addCredits(returnMoney);
            this.parent.creditsPopupOnTile(this.position.x, returnMoney);
        }
    },
    /* attempts to build any other kind of defence, assuming it needs a platform */
    buildDefault : function() {
        if (!this.building && (this.tileIndex == 0 || this.platform)) {
            this.building = this.parent.buildBuilding(this.position.x,
                PlayerData.selectedBuilding);
            if (this.platform) {
                this.platform.building = this.building;
            }
        } else {
            this.parent.popupCannotBuild(this.position.x);
        }
    },
    isPlatformLeft : function() {
        var tile = this.parent.getTile(this.tileIndex-1);
        if (tile && tile.platform) {
            return true;
        }
        return false;
    }
});

/* Animation with some added functions */
ExtendedAnimation = Model.Drawables.AnimatedDrawable.clone();
ExtendedAnimation.extend({
    /* Takes animation base paths like ./animation/walk and loads the spritesheet
    ./animation/walk.png and settingst at ./animation/walk.json if it exists */
    addAnimationsWithJSON : function(animationArray) {
        len = animationArray.length;
        for (var i = 0; i < len; i++) {
            var anim = Model.Drawables.AnimationDrawable.clone();
            var json = getJSON(animationArray[i] + ".json");
            anim.extend(json);
            anim.load(animationArray[i] + ".png");
            this.addAnimations(anim);
        }
    },
    /* Sync animation pause with global game pause */
    syncPause : function() {
        if (PlayerData.paused === !this.currentAnimation.paused) {
            this.currentAnimation.paused = !this.currentAnimation.paused;
        }
    },
});

/* The main type of object in the game. Actors can move around, have collision
detection, have health and many built in event functions. */
Actor = ExtendedAnimation.clone();
Actor.extend({
    name : "Actor",
    ignoremouse : true, /* let mouse clicks fall through to the tiles */
    size : settings.tileSize.clone(),
    centre: null, /* centre position */
    health : 2,
    invulnerable : false, /* if true, cannot take damage */
    direction : NONE, /* LEFT, RIGHT or NONE, used for movement */
    speed : 0, /* speed, scaled by tileSize, set via the setSpeed function */
    absoluteSpeed : 0, /* actual speed used for calculations */
    animations : [], /* list of animation sources */
    sounds : [], /* list of sound sources */
    goDie : false, /* used by onAnimationComplete to signal the end of the death
                      animation */
    deathAnimation : -1, /* animation(index) to play before dying, none if -1 */
    solid : true, /* if false, it can move while colliding with objects */
    reach : 1, /* how far ahead to check movement collisions, in pixels */
    collisionTag : collisionDefault,
    ignoreCollisions : [], /* array of collisionTags of objects it won't check
                              collisions with */
    actorList : null, /* list of actors to check collisions with */
    audio : null,
    onDrawInit : function() {
        this.absoluteSpeed = this.calculateAbsoluteSpeed();
        this.centre = this.calculateCentre();
        this.addAnimationsWithJSON(this.animations);
        this.showAnimation(0);
        this.audio = AudioPlayer.clone();
        this.audio.load(this.sounds);
        this.onInit();
    },
    preload : function() {
        for (var i = this.animations.length-1; i > -1; i--) {
            preload(this.animations[i] + ".png");
        }
    },
    /* sets its size and then recalculates its centre */
    setSize : function(size) {
        this.size = size;
        this.centre = this.calculateCentre();
    },
    setSpeed : function(speed) {
        this.speed = speed;
        this.absoluteSpeed = this.calculateAbsoluteSpeed();
    },
    centreOnTile : function(centreX, centreY) {
        if (centreX == null) centreX = true;
        if (centreY == null) centreY = true;
        this.position = new vec2(centreX ?
                    this.position.x + (settings.tileSize.x-this.size.x)/2
                :   this.position.x,
                             centreY ?
                    this.position.y + (settings.tileSize.y-this.size.y)/2
                :   this.position.y);
    },
    calculateAbsoluteSpeed : function() {
        return this.speed * settings.tileSize.x;
    },
    // Returns a new vec2 object containing the amount of pixels to its centre
    calculateCentre : function() {
        return new vec2(this.size.x / 2 , this.size.y / 2);
    },
    // Calls this.onUpdate, moves if needed and checks collisions if moving
    update : function() {
        this.syncPause();
        if (PlayerData.paused) return;
        if (this.goDie) {
            this.goDie = false;
            this.die();
        } else {
            var other;
            this.onUpdate();
            if (this.direction && this.speed) {
                if (other = !this.checkCollide({x:this.calculateMove(),
                                                y:this.position.y})) {
                    this.move();
                } else if (!this.solid || (other && !other.solid)) {
                    this.move();
                }
            }
        }
    },
    // Moves the Actor
    move : function() {
        this.position.x = this.calculateMove();
    },
    // Calculates its x position if it were to move now and returns it
    calculateMove : function() {
        return (this.position.x + this.direction * this.absoluteSpeed * deltaTime);
    },
    /* Checks collisions with all other actors of its actorList whose name tags
    aren't on the ignoreCollisions list */
    checkCollide : function(position) {
        if (this.actorList == null) return;
        if (position == null) position = this.position;
        for (var i = this.actorList.length-1; i > -1; i--) {
            var ignore = false;
            //if (this.actorList[i] == this) continue;
            for (var j = this.ignoreCollisions.length-1; j > -1; j--) {
                if (this.actorList[i].collisionTag === this.ignoreCollisions[j]) {
                    ignore = true;
                    break;
                }
            }
            if (ignore) continue;
            if (this.rayHitRect(new vec2(this.position.x + 
                        ((this.direction==LEFT) ? 0 : this.size.x),
                        this.position.y + this.centre.y),
                    this.direction * this.reach,
                    this.actorList[i].position, this.actorList[i].size)) {
                var other = this.actorList[i];
                other.onCollide(this);
                if (other) {
                    this.onCollide(other);
                }
                return other;
            }
        }
        return null;
    },
    /* Returns true if new vec2 object point is in rectangle with position
    rectPos and size rectSize, false otherwise. */
    pointInRect : function(point, rectPos, rectSize) {
        return (point.x > rectPos.x && point.x < rectPos.x + rectSize.x &&
                point.y >= rectPos.y && point.y <= rectPos.y + rectSize.y);
    },
    /* Returns true if line starting from position, with range range intersects
    with rectangle with position rectPos and size rectSize */
    rayHitRect : function(position, range, rectPos, rectSize) {
        return (position.y >= rectPos.y &&
                position.y <= rectPos.y + rectSize.y &&
                ((range < 0) ? (rectPos.x + rectSize.x - position.x >= range &&
                                rectPos.x - position.x <= 0)
                             : (rectPos.x - position.x <= range &&
                                rectPos.x + rectSize.x - position.x >= 0)));
    },
    /* Changes health and makes actor die if health goes below 0, ignores negative
    values if actor is invulnerable */
    changeHealth : function (amount) {
        if (!this.invulnerable || amount > 0) {
            this.health += amount;
            if (this.health <= 0) {
                if (this.deathAnimation == -1) {
                    this.die();
                } else {
                    this.showActorAnimation(this.deathAnimation);
                }
            }
            this.onChangeHealth();
        }
    },
    animatedDie : function() {
        if (this.deathAnimation >= 0) {
            this.showActorAnimation(this.deathAnimation);
            return 1;
        } else {
            this.die();
            return 0;
        }
    },
    /* calls the onDeath function and removes the actor from
    the actorlist and memory */
    die : function () {
        this.audio.stop();
        this.onDeath();
        if (this.actorList != null) {
            for (var i = this.actorList.length-1; i > -1; i--) {
                if (this.actorList[i] == this) {
                    this.actorList.splice(i, 1);
                    break;
                }
            }
        }
        this.parent.removeDrawable(this);
    },
    showActorAnimation : function(animation) {
        if (this.currentAnimationIndex === this.deathAnimation) return;

        this.showAnimation(animation);
    },
    playAudio : function(audioIndex) {
        if (PlayerData.audioEnabled) {
            this.audio.play(audioIndex);
        }
    },
    onAnimationComplete : function(currentAnimation) {
        if (currentAnimation === this.deathAnimation) {
            this.goDie = true;
        } else {
            this.customOnAnimationComplete(currentAnimation);
        }
    },
    customOnAnimationComplete : function(currentAnimation) {
    },
    // called when the actor is added to the field
    onInit : function() {
    },
    // called every frame
    onUpdate : function() {
    },
    // called on death
    onDeath : function() {
    },
    // called on collision with an object
    onCollide : function(other) {
    },
    // called when health is gained or lost with the changeHealth function
    onChangeHealth : function() {
    }
});


// Enemy moves to the left and attacks whatever defence or dyke comes in their way
Enemy = Actor.clone();
Enemy.extend({
    size : new vec2(settings.paalwormSize.x*settings.tileSize.x,
                settings.paalwormSize.y*settings.tileSize.y),
    treasure : null,
    poof : null,
    direction : LEFT,
    collisionTag : collisionEnemy,
    ignoreCollisions : [collisionEnemy, collisionDefence, collisionBullet,
                        collisionShell],
    attackTimer : 0,
    attackAnimation : 2,
    moveAnimationOffset : 0, /* Number between 0 and Math.PI*2 that is used to 
        synch the move animation with the movement speed */
    target : null,
    cooldown : settings.paalwormCooldown, // amount of seconds between attacks
    attritionTime : settings.paalwormAttritionTime, /* amount of seconds between 
        losing health automatically */
    attritionAmount : settings.paalwormAttritionAmount, /* amount of health lost
        every time by attrition */
    attritionTimer : null,
    poofCollision : -1,
    onInit : function () {
        this.attritionTimer = this.attritionTime;
        this.poof = DefenceHitEffect;
        this.centreOnTile(true, false);
        this.position.y += settings.tileSize.y * 0.05;
    },
    /* attacks given actor */
    attack : function (other) {
        this.playAudio(random(this.attackSounds[1], this.attackSounds[0]));
        this.poofCollision = other.collisionTag;
        other.changeHealth(-this.damage);
    },
    onUpdate : function () {
        this.attritionTimer -= deltaTime;
        if (this.attritionTimer <= 0) {
            this.changeHealth(-this.attritionAmount);
            this.attritionTimer = this.attritionTime;
        }
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }
        if (this.poofCollision != -1) {
            this.createPoof();
        }

        /* make speed non-linear, based on animation */
        this.absoluteSpeed = this.speed * 
            (Math.sin(this.currentAnimation._currentFrame /
                      this.currentAnimation.frameN * (2*Math.PI) + this.moveAnimationOffset) *
             0.5 + 0.5) * settings.tileSize.x;
    },
    createPoof : function() {
        var poof = this.parent.spawnEffect(new vec2(this.position.x -
                                                settings.tileSize.x * 0.2, 
                                     this.position.y + settings.tileSize.y * 0.3),
                                this.poof);
        if (this.poofCollision === collisionStone) {
            poof.showAnimation(1);
        }
        this.poofCollision = -1;
    },
    onChangeHealth : function () {
        this.playAudio(random(this.hitSounds[1], this.hitSounds[0]));
        this.showActorAnimation(1);
    },
    onCollide : function (other) {
        if (this.attackTimer <= 0) {
            this.showActorAnimation(this.attackAnimation);
            this.setTarget(other);
            this.attackTimer = this.cooldown;
        }
    },
    customOnAnimationComplete : function() {
        switch (this.currentAnimationIndex) {
            case this.attackAnimation:
                if (this.target != null) {
                    this.attack(this.target);
                    this.setTarget(null);
                }
                this.showActorAnimation(0);
                break;
            case 1:
                this.showActorAnimation(0);
                break;
        }
    },
    setTarget : function(target) {
        this.target = target;
    },
    onDeath : function () {
        this.parent.spawnActor(new vec2(this.position.x + this.size.x/2
                                        - this.treasure.size.x/2,
                                    this.position.y + this.size.y/2
                                        - this.treasure.size.y/2),
                               this.treasure,
                               settings.shellLayer);
    }
});

WeakEnemy = Enemy.clone();
WeakEnemy.extend({
    health : settings.weakPaalwormHealth,
    damage : settings.weakPaalwormDamage,
    speed : settings.paalwormSpeed,
    moveAnimationOffset : Math.PI,
    animations : ["./animation/paalworm_weak/move", "./animation/paalworm_weak/hit",
                  "./animation/paalworm_weak/attack"],
    hitSounds : [0, 0],
    attackSounds : [1, 2],
    sounds : ["./audio/paalworm/hit.ogg",
              "./audio/paalworm/attack1.ogg",
              "./audio/paalworm/attack2.ogg"],
    onInit : function() {
        this.treasure = WeakTreasure;
        Enemy.onInit.apply(this);
    }
});

StrongEnemy = Enemy.clone();
StrongEnemy.extend({
    health : settings.strongPaalwormHealth,
    damage : settings.strongPaalwormDamage,
    speed : settings.paalwormSpeed,
    moveAnimationOffset : Math.PI,
    animations : ["./animation/paalworm_strong/move", "./animation/paalworm_strong/hit",
                  "./animation/paalworm_strong/attack"],
    sounds : ["./audio/paalworm/hit_strong1.ogg",
              "./audio/paalworm/hit_strong2.ogg",
              "./audio/paalworm/hit_strong3.ogg",
              "./audio/paalworm/attack1.ogg",
              "./audio/paalworm/attack2.ogg"],
    hitSounds : [0, 2],
    attackSounds : [3, 4],
    onInit : function() {
        this.treasure = StrongTreasure;
        Enemy.onInit.apply(this);
    }
});

EnemyTypes = [WeakEnemy, StrongEnemy];

Defence = Actor.clone();
Defence.extend({
    name : "Defence",
    size : new vec2(settings.defenseSize.x*settings.tileSize.x,
                settings.defenseSize.y*settings.tileSize.y),
    sounds : ["./audio/heimeid/create.ogg"],
    collisionTag : collisionDefence,
    cooldown : settings.defenceCooldown,
    range : settings.defenceRange,
    cost : 0,
    onInit : function () {
        this.centreOnTile(true, false);
        if (this.position.x < settings.tileSize.x) {
            this.position.x -= this.size.x / 4;
        }
        this.playAudio(0);
    },
    // return true if an enemy is in range and on the same lane
    enemyInRange : function () {
        for (var i = this.actorList.length-1; i > -1; i--) {
            if (this.actorList[i].collisionTag == collisionEnemy && 
                this.rayHitRect(new vec2(this.position.x + this.size.x,
                        this.position.y + this.centre.y),
                    this.range * settings.tileSize.x,
                    this.actorList[i].position,
                    this.actorList[i].size)) {
                return true;
            }
        }
        return false;
    }
});

BuildHeimeid = Defence.clone();
BuildHeimeid.extend({
    animations : ["./animation/objects/platform/builder"],
    onUpdate : function() {
        if (this.goDie) {
            this.die();
        }
    },
    customOnAnimationComplete : function() {
        this.goDie = true;
    }
});

Stone = Defence.clone();
Stone.extend({
    animations : ["./animation/objects/rockblock/healthfull",
    "./animation/objects/rockblock/healthlost",
    "./animation/objects/rockblock/healthcritical",
    "./animation/objects/rockblock/break"],
    sounds : ["./audio/objects/stone_create.ogg",
              "./audio/sink.ogg"],
    deathAnimation : 3,
    collisionTag : collisionStone,
    health : settings.stoneHealth,
    cost : settings.stoneBuldCost,
    tile : null,
    onInit : function() {
        this.centreOnTile(true, true);
        this.playAudio();
    },
    onChangeHealth : function() {
        if (this.health <= 0) {
             this.playAudio(1);
        } else if (this.health < 0.3 * settings.dykeHealth) {
            this.showActorAnimation(2);
        } else if (this.health < 0.7 * settings.dykeHealth) {
            this.showActorAnimation(1);
        }
    },
    onDeath : function () {
        if (this.tile) {
            this.tile.reset();
        }
    }
});

Priest = Defence.clone();
Priest.extend({
    name : "Priest",
    cost : settings.priestBuildCost,
    animations : ["./animation/dominee/idle", "./animation/dominee/die"],
    sounds : ["./audio/priest/create.ogg",
              "./audio/sink.ogg"],
    deathAnimation : 1,
    directions : [new vec2(-1,0), new vec2(0,1), new vec2(1,0), new vec2(0,-1)],
    tileXY : new vec2(0,0),
    onUpdate : function() {
        for (var i = this.directions.length-1; i > -1; i--) {
            this.buffAt(this.directions[i].x, this.directions[i].y);
        }
    },
    onDeath : function() {
        for (var i = this.directions.length-1; i > -1; i--) {
            this.unBuffAt(this.directions[i].x, this.directions[i].y);
        }
    },
    getBuffableAt : function(X, Y) {
        var tile = this.parent.getTile(this.tileXY.x + X, this.tileXY.y + Y);
        if (tile != null && tile.building && tile.building.buff) {
            return tile.building;
        } else {
            return null;
        }
    },
    buffAt : function(X, Y) {
        var defence = this.getBuffableAt(X, Y);
        if (defence && !defence.isBuffed) {
            defence.buff();
        }
    },
    unBuffAt : function(X, Y) {
        var defence = this.getBuffableAt(X, Y);
        if (defence && defence.isBuffed) {
            defence.unBuff();
        }
    },
});

ShootingDefence = Defence.clone();
ShootingDefence.extend({
    animations : ["./animation/heimeid/idle", "./animation/heimeid/move",
    "./animation/heimeid/attack_wait", "./animation/heimeid/attack",
    "./animation/heimeid/die",
    "./animation/heimeid/idle_buffed", "./animation/heimeid/attack_buffed"],
    bullet : null,
    isBuffed : false,
    goSpawnBullet : false,
    attackAnimation : 3,
    buffedAttackAnimation : 6,
    deathAnimation : 4,
    attackTimer : 0,
    attackMode : false,
    cost : settings.defenceBuildCost,
    onInit : function() {
        this.bullet = Bullet;
        Defence.onInit.apply(this);
    },
    onUpdate : function() {
        // Handle attacking
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }
        if (this.enemyInRange()) {
            if (this.attackMode == false) {
                this.enterAttackMode();
            }
            if (this.attackTimer <= 0) {
                this.attack();
                this.attackTimer = this.cooldown;
            }
        } else if (this.attackMode == true) {
            this.exitAttackMode();
        }

        // Throw a stone if ready
        if (this.goSpawnBullet) {
            this.goSpawnBullet = false;
            var bul = this.parent.spawnActor(new vec2(
                    this.position.x + 109,
                    this.position.y + 55),
                this.bullet,
                settings.bulletLayer);
            if (this.isBuffed) {
                bul.buff();
            }
            this.endAttack();
        }
    },
    enterAttackMode : function() {
        this.attackMode = true;
        this.goIdle();
    },
    exitAttackMode : function() {
        this.attackMode = false;
        this.goIdle();
    },
    attack : function () {
        if (this.isBuffed) {
            this.showActorAnimation(this.buffedAttackAnimation);
        } else {
            this.showActorAnimation(this.attackAnimation);
        }
    },
    endAttack : function() {
        this.goIdle();
    },
    customOnAnimationComplete : function(currentAnimation) {
        switch(currentAnimation) {
            case this.attackAnimation:
            case this.buffedAttackAnimation:
                this.goSpawnBullet = true;
                break;
        }
    },
    buff : function() {
        this.isBuffed = true;
        this.cooldown = settings.defenceBuffedCooldown;
        if(this.currentAnimationIndex == 0) {
            this.goIdle();
        }
    },
    unBuff : function() {
        this.isBuffed = false;
        this.cooldown = settings.defenseCooldown;
        if(this.currentAnimationIndex == 5) {
            this.goIdle();
        }
    },
    goIdle : function() {
        if (this.isBuffed) {
            this.showActorAnimation(5);
        } else {
            this.showActorAnimation(0);
        }
    }
});

// If the dyke is destroyed, the player loses
Dyke = Actor.clone();
Dyke.extend({
    name : "Dyke",
    size : new vec2(settings.tileSize.x, settings.tileSize.y * settings.lanes),
    animations : ["./animation/objects/dyke/healthfull",
                  "./animation/objects/dyke/healthlost",
                  "./animation/objects/dyke/healthcritical",
                  "./animation/objects/dyke/die"],
    sounds : ["./audio/sink.ogg"],
    deathAnimation : 3,
    dykeFloor : null,
    health : settings.dykeHealth,
    onInit : function() {
        this.dykeFloor = DykeFloor;
    },
    onChangeHealth : function() {
        if (this.health <= 0) {
            this.playAudio();
            this.parent.lose();
        } else if (this.health < 0.3 * settings.dykeHealth) {
            this.showActorAnimation(2);
            this.dykeFloor.changeWaterLevel(2);
        } else if (this.health < 0.7 * settings.dykeHealth) {
            this.showActorAnimation(1);
            this.dykeFloor.changeWaterLevel(1);
        }
    }
});

// Moves to the right and wounds enemies on impact
Bullet = Actor.clone();
Bullet.extend({
    name : "Bullet",
    size : new vec2(settings.tileSize.x * settings.bulletSize,
                settings.tileSize.y * settings.bulletSize),
    animations : ["./animation/objects/stone", "./animation/objects/stone_buffed"],
    direction : RIGHT,
    poof : null,
    invulnerable : true,
    isBuffed : false,
    speed : settings.bulletSpeed,
    damage : settings.bulletDamage,
    collisionTag : collisionBullet,
    ignoreCollisions : [collisionDefault, collisionDefence, collisionPlatform,
                        collisionBullet, collisionShell, collisionStone],
    onInit : function() {
        this.poof = WormHitEffect;
    },
    onUpdate : function() {
        if (this.position.x + this.size.x >= FIELD_SIZE) {
            this.die();
        }
    },
    onCollide : function (other) {
        other.changeHealth(-this.damage);
        var poof = this.parent.spawnEffect(new vec2(this.position.x +
                                                settings.tileSize.x * 0.125, 
                                     this.position.y + settings.tileSize.y * 0.125),
                                this.poof);
        if (this.isBuffed) {
            poof.showAnimation(1);
        }
        this.die();
    },
    buff : function () {
        this.isBuffed = true;
        this.showActorAnimation(1);
        this.damage = settings.bulletBuffedDamage;
    }
});

// Gives player credits if clicked on
Treasure = Actor.clone();
Treasure.extend({
    name : "Treasure",
    ignoremouse : false,
    sounds : ["./audio/money.ogg"],
    fadeShell : "",
    fadeCounter : 0,
    fadeTime : settings.shellFadeTime,
    collisionTag : collisionShell,
    invulnerable : true,
    worth : 2,
    solid : false,
    size : new vec2(settings.tileSize.x * settings.shellSize.x,
                settings.tileSize.y * settings.shellSize.y),
    onUpdate : function() {
        this.fadeCounter += deltaTime;
        this.currentAnimation.alpha = 1 - (this.fadeCounter / this.fadeTime);
        if (this.fadeCounter > this.fadeTime) {
            this.die();
        }
    },
    onmousedown : function () {
        if (!PlayerData.paused) {
            this.parent.addCredits(this.worth);
            popupText(new vec2(this.position.x + this.size.x/2,
                            this.position.y),
                            "+" + this.worth);
            popupImage(this.position, this.size, this.fadeShell);
            this.die();
            this.playAudio();
        }
    }
});

WeakTreasure = Treasure.clone();
WeakTreasure.extend({
    worth : settings.weakShellWorth,
    animations : ["./animation/objects/shell_weak"],
    fadeShell : "./images/game/shell_weak_fade.png"
});

StrongTreasure = Treasure.clone();
StrongTreasure.extend({
    worth : settings.strongShellWorth,
    animations : ["./animation/objects/shell_strong"],
    fadeShell : "./images/game/shell_strong_fade.png"
});

Platform = Actor.clone()
Platform.extend({
    name : "Platform",
    animations : ["./animation/objects/platform/healthy",
    "./animation/objects/platform/broken",
    "./animation/objects/platform/die"],
    brokenAnimation : 1,
    deathAnimation : 2,
    sounds : ["./audio/objects/platform_create.ogg", "./audio/sink.ogg"],
    health : settings.platformHealth,
    building : null,
    tile : null,
    collisionTag : collisionPlatform,
    cost : settings.platformBuildCost,
    onInit : function() {
        this.playAudio(0);
    },
    onChangeHealth : function() {
        if (this.health <= 0) {
            this.playAudio(1);
            if (this.building) {
                this.building.animatedDie();
            }
            if (this.builder) {
                this.builder.animatedDie();
            }
            if (this.tile) {
                this.tile.reset();
            }
        } else if (this.health <= 0.5 * settings.platformHealth) {
            this.showActorAnimation(this.brokenAnimation);
        }
    },
});

Effect = ExtendedAnimation.clone()
Effect.extend({
    name : "Effect",
    ignoremouse : true,
    size : new vec2(settings.tileSize.x * 0.75, settings.tileSize.y * 0.75),
    onDrawInit : function() {
        this.addAnimationsWithJSON(this.animations);
        this.showAnimation(0);
    },
    update : function() {
        this.syncPause();
    },
    onAnimationComplete : function(currentAnimation) {
        this.parent.removeDrawable(this);
    },
    preload : function() {
        Actor.preload.apply(this);
    }
});

WormHitEffect = Effect.clone();
WormHitEffect.extend({
    animations : ["./animation/effects/poof", "./animation/effects/poof2"],
});

DefenceHitEffect = Effect.clone();
DefenceHitEffect.extend({
    animations : ["./animation/effects/poof_wood",
    "./animation/effects/poof_stone"],
});

DykeSupports = Model.Drawables.BaseDrawable.clone();
DykeSupports.extend({
    supports : Model.Drawables.SpriteDrawable.clone(),
    image : "./images/game/dyke/supports_front.png",
    onDrawInit : function() {
        this.supports.load(this.image);
        this.supports.position = new vec2(0, settings.tileSize.y * 1.4);
        this.supports.size = new vec2(212, 632);
        this.addDrawable(this.supports);
    },
    preload : function() {
        preload(this.image);
    }
});

DykeFloor = Model.Drawables.BaseDrawable.clone();
DykeFloor.extend({
    size : new vec2(212, 984),
    ignoremouse : true,
    grassImage : "./images/game/dyke/grass.png",
    supportsImage : "./images/game/dyke/supports_back.png",
    waterImage1 : "./images/game/dyke/water_01.png",
    waterImage2 : "./images/game/dyke/water_02.png",
    supports : Model.Drawables.SpriteDrawable.clone(),
    grass : Model.Drawables.SpriteDrawable.clone(),
    water : Model.Drawables.SpriteDrawable.clone(),
    onDrawInit : function() {
        this.grass.load(this.grassImage);
        this.grass.size = this.size;
        this.addDrawable(this.grass);
        this.water.size = new vec2(212, 984);
        this.changeWaterLevel(0);
        this.addDrawable(this.water);
        this.supports.load(this.supportsImage);
        this.supports.size = new vec2(this.size.x, 353);
        this.addDrawable(this.supports);
    },
    changeWaterLevel : function(newLevel) {
        if (newLevel > 2 || newLevel < 0) return;
        if (newLevel == 2) {
            this.water.visible = true;
            this.water.load(this.waterImage2);
        } else if (newLevel == 1) {
            this.water.visible = true;
            this.water.load(this.waterImage1);
        } else {
            this.water.visible = false;
        }
    },
    reset : function() {
        this.changeWaterLevel(0);
    },
    preload : function() {
        preload(this.grassImage);
        preload(this.supportsImage);
        preload(this.waterImage1);
        preload(this.waterImage2);
    }
});

DykeShore = Model.Drawables.SpriteDrawable.clone();
DykeShore.extend({
    size : new vec2(250, 984),
    ignoremouse : true,
    image : "./images/game/dyke/shore_water.png",
    onDrawInit : function() {
        this.load(this.image);
    },
    preload : function() {
        preload(this.image);
    }
});

BackgroundWaves = Model.Drawables.SpriteDrawable.clone();
BackgroundWaves.extend({
    size : new vec2(2106, 1306),
    alpha : 1,
    originPosition : null,
    radius : 108,
    rotationSpeed : settings.waveSpeed,
    wavesImage : "./images/game/water_waves.png",
    currentRotation : 0,
    preload : function() {
        preload(this.wavesImage);
    },
    onDrawInit : function() {
        this.load(this.wavesImage);
        this.originPosition = {
            x : this.position.x - this.radius,
            y : this.position.y - this.radius
        }
    },
    update : function() {
        if (PlayerData.paused) return;
        this.currentRotation += this.rotationSpeed * deltaTime;
        if (this.rotationSpeed > 2 * Math.PI) {
            this.currentRotation = 0;
        }
        this.position = {
            x : this.originPosition.x + Math.sin(this.currentRotation) *
                this.radius,
            y : this.originPosition.y + Math.cos(this.currentRotation) *
                this.radius
        }
    }
});

BackgroundFish = Model.Drawables.SpriteDrawable.clone();
BackgroundFish.extend({
    name : "fish",
    alpha : 1,
    fishId : 0,
    ignoremouse : true,
    size : {x: 370, y: 131},
    speed : settings.fishSpeed,
    fishImage : "./images/game/fish.png",
    destination : 0,
    halfway : 0,
    disappearOffset : 40,
    onDrawInit : function() {
        this.load(this.fishImage);
        this.destination = this.position.x - settings.fishMoveDistance;
        this.halfway = this.position.x - (settings.fishMoveDistance - this.disappearOffset) / 2;
    },
    preload : function() {
        preload(this.fishImage);
    },
    update : function() {
        if (PlayerData.paused) return;

        this.alpha = settings.fishMaxAlpha -
                          (Math.abs(this.position.x - this.halfway) /
                              (this.halfway - this.destination - this.disappearOffset))
                          * settings.fishMaxAlpha;
        this.position.x = lerp(this.position.x, this.destination, this.speed);
        if (inRange(this.position.x, this.destination, this.disappearOffset)) {
            this.parent.removeFishWithId(this.fishId);
        }
    }
});

RemoveDefence = {};
// pseudo-JSON, because we need comments!

Waves = {
"waves" : [
// wave 1
    {
        "subWaves" : [
            {"enemies" : [4] }
        ],
        "spawnInterval" : {"min": 11, "max": 11},
        "unlockBuildings" : [ShootingDefence, RemoveDefence]
    },

// wave 2
    {
        "subWaves" : [
            {"enemies" : [8] }
        ],
        "spawnInterval" : {"min": 2, "max": 5},
        "unlockBuildings" : [Stone]
    },

// wave 3
    {
        "subWaves" : [
            {"enemies" : [8] },
            {"enemies" : [1, 2] }
        ],
        "spawnInterval" : {"min": 2, "max": 5},
        "unlockBuildings" : [Platform]
    },

// wave 4
    {
        "subWaves" : [
            {"enemies" : [6, 4] },
            {"enemies" : [4, 6] }
        ],
        "spawnInterval" : {"min": 2, "max": 4},
        "maxEnemies" : 7,
        "unlockBuildings" : [Priest]
    },

// wave 5
    {
        "subWaves" : [
            {"enemies" : [8, 5] },
            {"enemies" : [5, 13] }
        ],
        "spawnInterval" : {"min": 1, "max": 2},
        "maxEnemies" : 10
    }
]
}
/* Class Game contains all game objects and manages the game. Every non-gui object
in the game is eventually a child of Game. */
Game = Model.Drawables.BaseDrawable.clone();
Game.extend({
    position : settings.fieldPosition.clone(),
    Lanes : new Array(settings.lanes), /* array of lanes that contan all the tiles */
    Actors : new Array(), /* array that contains all the actors on the field */
    Popups : new Array(), /* array that contains all popups and
                             effects on the field */
    dyke : null, /* direct reference to the dyke actor */
    dykeObjects : [DykeFloor, DykeSupports, DykeShore], /* reference to objects
                            that are part of the dyke but behind other actors */

    active : false, /* do not start the update loop immediately */
    background : Model.Drawables.SpriteDrawable.clone(), /* the tiled water
                                                            background */
    waves : BackgroundWaves, /* the moving waves in the background */
    gui : GUI, /* direct reference to the GUI */

    backgroundMusic : null,

    /* array of objects to preload images of */
    preloadObjects : [FinalScreen, WeakEnemy, StrongEnemy, Stone, Priest,
                      ShootingDefence, Dyke, Bullet, WeakTreasure, StrongTreasure,
                      Platform, BackgroundFish, BackgroundWaves, DykeSupports,
                      DykeFloor, DykeShore],

    /* initializes the game, should only be called once per load */
    initialize : function() {
        this.preload();
        this.initSelf();
        this.initMusic();
        this.initDrawables();
        this.initGUI();
    },
    /* calls the preload function for each of the objects given by preloadObjects */
    preload : function() {
        for (i = this.preloadObjects.length-1; i > -1; i--) {
            this.preloadObjects[i].preload();
        }
        startPreload();
    },
    /* initializes own values */
    initSelf : function() {
        this.size = new vec2(View.canvasWidth, View.canvasHeight);
        Model.addDrawable(this);
    },
    /* initializes ambient background sound/music */
    initMusic : function() {
        this.backgroundMusic = AudioPlayer.clone();
        this.backgroundMusic.load("./audio/music.ogg");
    },
    /* initializes all static drawableObjects,
       should only be called once per load */
    initDrawables : function() {
        this.background.size = new vec2(settings.tileSize.x *
                                            (settings.tilesPerLane),
                                        settings.tileSize.y * settings.lanes);
        this.background.visible = false;
        this.background.alpha = 0.99;
        this.background.load("./images/game/water.png");
        this.addDrawable(this.background, settings.backgroundImageLayer);
        for (var i = this.Lanes.length-1; i > -1; i--) {
            this.Lanes[i] = Lane.clone();
            this.Lanes[i].setLanePos(i);
            this.Lanes[i].visible = false;
            this.addDrawable(this.Lanes[i], settings.groundLayer);
        }
        this.addDrawable(EnemyController);
        this.addDrawable(this.dykeObjects[0], settings.groundLayer);
        this.addDrawable(this.dykeObjects[1], settings.dykeLayer);
        this.addDrawable(this.dykeObjects[2], settings.shoreLayer);
        for (i = this.dykeObjects.length-1; i > -1; i--) {
            this.dykeObjects[i].visible = false;
        }
        this.waves.visible = false;
        this.addDrawable(this.waves, settings.wavesLayer);
    },
    /* initializes the GUI and starts the menu */
    initGUI : function() {
        this.gui.init();
        this.gui.menuStart();
    },
    /* starts the game */
    gameStart : function() {
        console.log("Starting Heimeiden...");
        for (var i = this.Lanes.length-1; i > -1; i--) {
            this.Lanes[i].visible = true;
        }
        for (i = this.dykeObjects.length-1; i > -1; i--) {
            this.dykeObjects[i].visible = true;
        }
        this.background.visible = true;
        this.waves.visible = true;
        this.active = true;
        this.dyke = this.spawnActor(new vec2(0,0), Dyke, settings.dykeLayer);
        this.gui.active = true;
        EnemyController.start();
        PlayerData.reset();
        this.dykeObjects[0].reset();
    },
    /* functions called constantly when the game is active */
    update : function() {
        this.syncAudioPause();
        if (!PlayerData.paused) {
            this.updateAudio();
            this.updateCredits();
            this.checkWin();
            this.checkEndOfGame();
            this.updateFish();
        }
    },
    updateAudio : function() {
        if (settings.backgroundMusic == false || !PlayerData.audioEnabled) return;
        PlayerData.timeUntilRestartMusic -= deltaTime;
        if (PlayerData.timeUntilRestartMusic <= 0) {
            this.backgroundMusic.play();
            PlayerData.timeUntilRestartMusic = random(settings.backgroundLoopInterval.max,
                                                      settings.backgroundLoopInterval.min);
        }
    },
    syncAudioPause : function() {
        if (PlayerData.paused && !this.backgroundMusic.paused) {
            this.backgroundMusic.pause();
        } else if (!PlayerData.paused && PlayerData.audioEnabled &&
                   this.backgroundMusic.paused) {
            this.backgroundMusic.unpause();
        }
    },
    /* handles getting credits automatically over time */
    updateCredits : function() {
        if (!PlayerData.giveCredits) return;
        PlayerData.creditsTimer += deltaTime;
        if (PlayerData.creditsTimer >= settings.secondsToCreditUpdate) {
            PlayerData.creditsTimer = 0;
            this.addCredits(settings.creditsPerCreditUpdate);
        }
    },
    /* checks if the player has won the game */
    checkWin : function() {
        if (PlayerData.areWavesFinished &&
            PlayerData.finalCountDown == INACTIVE) {
            if (this.countActors(collisionEnemy) == 0) {
                this.win();
            }
        }
    },
    /* checks if the game has to be ended */
    checkEndOfGame : function() {
        if (PlayerData.finalCountDown > INACTIVE) {
            PlayerData.finalCountDown -= deltaTime;
            if (PlayerData.finalCountDown < 0) {
                this.endGame();
            }
        }
    },
    /* handles adding fishes once in a while */
    updateFish : function() {
        PlayerData.timeUntilNextFish -= deltaTime;
        if (PlayerData.timeUntilNextFish <= 0) {
            this.spawnFish();
            PlayerData.timeUntilNextFish = random(settings.fishSpawnRate.max,
                                                  settings.fishSpawnRate.min);
        }
    },
    /* adds given amount of credits to the player's credit count */
    addCredits : function(credits) {
        PlayerData.credits += credits;
    },
    /* stops the game */
    gameStop : function() {
        for (var i = this.Lanes.length-1; i > -1; i--) {
            this.Lanes[i].reset();
            this.Lanes[i].visible = false;
        }
        for (i = this.Actors.length-1; i > -1; i--) {
            this.removeDrawable(this.Actors[i]);
        }
        for (i = this.Popups.length-1; i > -1; i--) {
            this.removeDrawable(this.Popups[i]);
        }
        for (i = this.dykeObjects.length-1; i > -1; i--) {
            this.dykeObjects[i].visible = false;
        }
        this.Actors = new Array();
        this.Popups = new Array();
        this.background.visible = false;
        this.waves.visible = false;
        this.active = false;
        this.gui.active = false;
        PlayerData.areWavesFinished = false;
        EnemyController.stop();
        EnemyController.reset();
    },
    /* attempts to build buildingObject at given position, and substracts its cost
       from the player's treasury if the player has enough */
    buildBuilding : function(position, buildingObject) {
        if (!PlayerData.canBuild) return;
        if (PlayerData.credits >= buildingObject.cost) {
            PlayerData.credits -= buildingObject.cost;
            if (settings.deselectIconAfterBuild) {
                GUI.deselectBuilding();
            }
            layer = (position.x < this.dyke.position.x + this.dyke.size.x) ?
                        settings.backCharacterLayer :
                        settings.characterLayer;
            this.creditsPopupOnTile(position, buildingObject.cost, false);
            return this.spawnActor(position, buildingObject, layer);
        } else {
            var noMoneyIconSize = new vec2(106, 98);
            var noMoneyIconPosition = new vec2();
            noMoneyIconPosition.x =
                position.x + settings.tileSize.x / 2 - noMoneyIconSize.x / 2;
            noMoneyIconPosition.y =
                position.y + settings.tileSize.y / 2 - noMoneyIconSize.y / 2;
            popupImage(noMoneyIconPosition,
                       noMoneyIconSize,
                       "./images/gui/no_money.png",
                       0.75, false);
            return null;
        }
    },
    /* makes a popup on tile at tilePosition for credit add/remove feedback */
    creditsPopupOnTile : function(tilePosition, amount, positive) {
        if (amount === 0) return;
        if (positive == null) {
            positive = true;
        }
        popupText(new vec2(settings.tileSize.x * 0.5,
                           settings.tileSize.y * 0.25).add(tilePosition),
                  (positive? "+" : "-") + amount,
                  (positive? null : "#FE0000"));
    },
    /* spawns enemy enemyNumber at given lane index */
    spawnEnemy : function(lane, enemyNumber) {
        this.spawnActor(new vec2((settings.tilesPerLane) * settings.tileSize.x,
                             lane * settings.tileSize.y),
                        EnemyTypes[enemyNumber]);
    },
    /* spawns given actor object at given position and layer,
       defaults to characterLayer */
    spawnActor : function (position, actorObject, layer) {
        if (layer == null) layer = settings.characterLayer;
        var actor = actorObject.clone();
        if (actor.name == "Priest") {
            actor.tileXY = new vec2(position.x / settings.tileSize.x,
                                position.y / settings.tileSize.y);
        }
        actor.position = position.clone();
        this.addActor(actor, layer);
        return actor;
    },
    /* spawns a fish at a random location in the water */
    spawnFish : function() {
        var fish = BackgroundFish.clone();
        fish.fishId = PlayerData.currentFishId;
        PlayerData.currentFishId++;
        fish.position.x = random(1920 - settings.fieldPosition.x - fish.size.x,
            fish.size.x + settings.fishMoveDistance + this.dyke.size.x);
        fish.position.y = random(1080 - settings.fieldPosition.y - fish.size.y,
            fish.size.y);
        this.addDrawable(fish, settings.fishLayer);
        this.Popups[this.Popups.length] = fish;
    },
    /* adds an actor to the field */
    addActor : function(actor, layer) {
        this.Actors[this.Actors.length] = actor;
        actor.actorList = this.Actors;
        this.addDrawable(actor, layer);
    },
    /* spawns effectobject at given position */
    spawnEffect : function(position, effectObject) {
        var effect = effectObject.clone();
        effect.position = new vec2(position.x - effectObject.size.x / 2,
                               position.y - effectObject.size.y / 2);
        this.addDrawable(effect, settings.effectLayer);
        this.Popups[this.Popups.length] = effect;
        return effect;
    },
    /* removes fish with given fishId */
    removeFishWithId : function(id) {
        for (var i=0; i<this.Popups.length; i++) {
            if (this.Popups[i].fishId == id) {
                this.removeDrawable(this.Popups[i]);
                this.Popups.splice(i, 1);
                return;
            }
        }
    },
    /* counts number of actors with given collision tags and returns it */
    countActors : function(collisionTag) {
        var count = 0;
        for (var i = this.Actors.length-1; i > -1; i--) {
            if (this.Actors[i].collisionTag == collisionTag) {
                count++;
            }
        }
        return count;
    },
    /* kills all defences on the field */
    killAllDefences : function() {
        this.killAllWithName("Platform");
        this.killAllWithName("Defence");
        this.killAllWithName("Priest");
    },
    /* kills all actors on the field whose name matches the one given */
    killAllWithName : function(name) {
        for (var i=0; i<this.Actors.length;) {
            if (this.Actors[i].name == name) {
                if (this.Actors[i].animatedDie()) {
                    i++;
                }
            } else {
                i++;
            }
        }
    },
    /* called when no more enemies will be spawned */
    wavesFinished : function() {
        PlayerData.areWavesFinished = true;
    },
    /* called when the player wins the game */
    win : function() {
        PlayerData.finalCountDown = settings.timeUntilFreeze;
    },
    /* called when the player loses the game */
    lose : function() {
        for (i = this.dykeObjects.length-1; i > -1; i--) {
            this.dykeObjects[i].visible = false;
        }
        this.killAllDefences();
        PlayerData.canBuild = false;
        PlayerData.lost = true;
        PlayerData.finalCountDown = settings.timeUntilFreeze;
    },
    /* freezes and ends the game */
    endGame : function() {
        PlayerData.paused = true;
        PlayerData.endOfGame = true;
        this.gui.endGame();
    },
    /* gets tile at given X and Y indexes */
    getTile : function(X, Y) {
        if (Y >= 0 && Y < this.Lanes.length) {
            return this.Lanes[Y].getTile(X);
        } else {
            return null;
        }
    }
});

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
