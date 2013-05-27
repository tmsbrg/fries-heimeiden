/* Class Game contains all game objects and manages the game. Every object
in the game is eventually a child of Game. */
Game = Model.Drawables.BaseDrawable.clone();
Game.extend({
    position : settings.fieldPosition.clone(),
    Lanes : new Array(settings.lanes),
    Actors : new Array(),
    Popups : new Array(),
    dyke : null,
    dykeObjects : [DykeFloor, DykeSupports],
    active : false,
    background : Model.Drawables.SpriteDrawable.clone(),
    waves : BackgroundWaves,
    gui : GUI,
    // Initializes the game, should only be called once per load
    initialize : function() {
        this.initConstants();
        this.initSelf();
        this.initDrawables();
        this.initGUI();
    },
    initConstants : function() {
        // calculated constants from settings
        FIELD_SIZE = settings.tileSize.x * settings.tilesPerLane;
    },
    initSelf : function() {
        this.size = vec2(View.canvasWidth, View.canvasHeight);
        Model.addDrawable(this);
    },
    // Initializes all static drawableObjects, should only be called once per load
    initDrawables : function() {
        this.background.size = vec2(settings.tileSize.x * (settings.tilesPerLane),
                                    settings.tileSize.y * settings.lanes);
        this.background.visible = false;
        this.background.load("./images/game/water.png");
        this.addDrawable(this.background, settings.backgroundImageLayer);
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i] = Lane.clone();
            this.Lanes[i].setLanePos(i);
            this.Lanes[i].visible = false;
            this.addDrawable(this.Lanes[i], settings.groundLayer);
        }
        this.addDrawable(EnemyController);
        this.addDrawable(this.dykeObjects[0], settings.groundLayer);
        this.addDrawable(this.dykeObjects[1], settings.dykeLayer);
        for (i=0; i<this.dykeObjects.length; i++) {
            this.dykeObjects[i].visible = false;
        }
        this.waves.visible = false;
        this.addDrawable(this.waves, settings.wavesLayer);
    },
    initGUI : function() {
        this.gui.init();
        this.gui.startMenu();
    },
    // Starts the game
    gameStart : function() {
        console.log("Starting Heimeiden...");
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i].visible = true;
        }
        for (i=0; i<this.dykeObjects.length; i++) {
            this.dykeObjects[i].visible = true;
        }
        this.background.visible = true;
        this.waves.visible = true;
        this.active = true;
        this.dyke = this.spawnActor(vec2(0,0), Dyke, settings.dykeLayer);
        this.gui.active = true;
        EnemyController.start();
        PlayerData.reset();
        this.dykeObjects[0].reset();
    },
    update : function() {
        if (!PlayerData.paused) {
            this.updateCredits();
        }
        if (PlayerData.areWavesFinished) {
            if (this.countActors("Enemy") == 0) {
                this.win();
            }
        }
    },
    updateCredits : function() {
        PlayerData.creditsTimer += deltaTime;
        if (PlayerData.creditsTimer >= settings.secondsToCreditUpdate) {
            PlayerData.creditsTimer = 0;
            this.addCredits(settings.creditsPerCreditUpdate);
        }
    },
    addCredits : function(credits) {
        PlayerData.credits += credits;
    },
    // Stops the game
    gameStop : function() {
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i].reset();
            this.Lanes[i].visible = false;
        }
        for (i=0; i<this.Actors.length; i++) {
            this.removeDrawable(this.Actors[i]);
        }
        for (i=0; i<this.Popups.length; i++) {
            this.removeDrawable(this.Popups[i]);
        }
        for (i=0; i<this.dykeObjects.length; i++) {
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
    buildBuilding : function(position, buildingObject) {
        if (PlayerData.credits >= buildingObject.cost) {
            GUI.deselectBuilding();
            PlayerData.credits -= buildingObject.cost;
            return this.spawnActor(position, buildingObject);
        } else {
            console.log("Not enough credits to build this defence!");
        }
    },
    // Spawns an enemy at lane index lane
    spawnEnemy : function(lane) {
        this.spawnActor(vec2((settings.tilesPerLane-1) * settings.tileSize.x,
                             lane * settings.tileSize.y),
                        Enemy);
    },
    // Spawns an actor object at exact position position
    spawnActor : function (position, actorObject, layer) {
        if (layer == null) layer = settings.characterLayer;
        var actor = actorObject.clone();
        actor.position = position.clone();
        this.addActor(actor, layer);
        return actor;
    },
    // Adds an actor to the field
    addActor : function(actor, layer) {
        this.Actors[this.Actors.length] = actor;
        actor.actorList = this.Actors;
        this.addDrawable(actor, layer);
    },
    spawnEffect : function(position, effectObject) {
        var effect = effectObject.clone();
        effect.position = vec2(position.x - effectObject.size.x / 2,
                               position.y - effectObject.size.y / 2);
        this.addDrawable(effect, settings.effectLayer);
        this.Popups[this.Popups.length] = effect;
    },
    countActors : function(actorName) {
        var count = 0;
        for (var i=0; i<this.Actors.length; i++) {
            if (this.Actors[i].name == actorName) {
                count++;
            }
        }
        return count;
    },
    pauseAnimations : function() {
        for (i=0; i<this.Actors.length; i++) {
            this.Actors[i].pause();
        }
        for (i=0; i<this.Popups.length; i++) {
            this.Popups[i].pause();
        }
    },
    unPauseAnimations : function() {
        for (i=0; i<this.Actors.length; i++) {
            this.Actors[i].unpause();
        }
        for (i=0; i<this.Popups.length; i++) {
            this.Popups[i].unpause();
        }
    },
    wavesFinished : function() {
        PlayerData.areWavesFinished = true;
    },
    win : function() {
        console.log("You win the game!");
        this.endGame();
    },
    lose : function() {
        console.log("You lost the game!");
        this.endGame();
    },
    endGame : function() {
        PlayerData.paused = true;
        PlayerData.endOfGame = true;
    }
});

// Contains data for the player
PlayerData = {
    paused : null,
    credits : null,
    endOfGame : null,
    creditsTimer : null,
    selectedBuilding : null,
    audioEnabled : null,
    areWavesFinished : null,
    selectedBuilding : null,
    reset : function() {
        this.paused = false;
        this.credits = settings.startingCredits;
        this.endOfGame = false;
        this.creditsTimer = 0;
        this.selectedBuilding = null;
        this.audioEnabled = true;
        this.areWavesFinished = false;
        this.selectedBuilding = null;
    }
};

// Draws fading text popup at given position
popupText = function(position, text) {
    var popupText = Model.Drawables.TextDrawable.clone();
    popupText.position = position.clone();
    popupText.font = "normal 48px US_Sans";
    popupText.color = "red";
    popupText.setText(text);
    popupText.timeout = settings.popupTimeout; 
    popupText.timeleft = settings.popupTimeout;
    popupText.speed = settings.popupSpeed;
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
        this.size = vec2((1 - this.timeleft / this.timeout) * this.endSize.x,
                         (1 - this.timeleft / this.timeout) * this.endSize.y);
        this.position = vec2(this.startPosition.x -
                (this.size.x-this.endSize.x) / 2,
                this.startPosition.y - (this.size.y-this.endSize.y) / 2);
        if (this.timeleft <= 0) {
            Game.removeDrawable(this);
        }
    }
    Game.Popups[Game.Popups.length] = rect;
    Game.addDrawable(rect);
}

popupImage = function(position, size, image) {
    var sprite = Model.Drawables.SpriteDrawable.clone();
    sprite.startPosition = position.clone();
    sprite.endSize = size.clone();
    sprite.load(image);
    sprite.timeout = settings.popupRectTimeout;
    sprite.timeleft = sprite.timeout;
    sprite.update = function() {
        if (PlayerData.paused) return;
        this.timeleft -= deltaTime;
        this.alpha = this.timeleft / this.timeout;
        this.size = vec2((1 - this.timeleft / this.timeout) * this.endSize.x,
                         (1 - this.timeleft / this.timeout) * this.endSize.y);
        this.position = vec2(this.startPosition.x -
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
// Called by rendering engine when everything is loaded
initialize = function() {
        Game.initialize();
}
