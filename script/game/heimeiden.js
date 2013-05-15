/* Class Game contains all game objects and manages the game. Every object
in the game is eventually a child of Game. */
Game = Model.Drawables.BaseDrawable.clone();
Game.extend({
    position : settings.fieldPosition.clone(),
    Lanes : new Array(settings.lanes),
    Actors : new Array(),
    Popups : new Array(),
    dyke : null,
    active : false,
    background : Model.Drawables.SpriteDrawable.clone(),
    pauseButton : Model.Drawables.ButtonDrawable.clone(),
    startButton : Model.Drawables.ButtonDrawable.clone(),
    stopButton : Model.Drawables.ButtonDrawable.clone(),
    fpsTextBox : Model.Drawables.TextDrawable.clone(),
    creditsTextBox : Model.Drawables.TextDrawable.clone(),
    dykeHealthBox : Model.Drawables.TextDrawable.clone(),
    // Initializes the game, should only be called once per load
    initialize : function() {
        this.initConstants();
        this.initSelf();
        this.initDrawables();
        this.startMenu();
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
        this.initFPS();
        this.initCreditsText();
        this.initDykeHealth();
        this.background.size = vec2(settings.tileSize.x * (settings.tilesPerLane),
                                    settings.tileSize.y * settings.lanes);
        this.background.visible = false;
        this.background.load("./images/game/water.png");
        this.addDrawable(this.background, settings.backgroundImageLayer);
        this.pauseButton.visible = false;
        this.stopButton.visible = false;
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i] = Lane.clone();
            this.Lanes[i].setLanePos(i);
            this.Lanes[i].visible = false;
            this.addDrawable(this.Lanes[i], settings.groundLayer);
        }
        this.pauseButton.size = {x:50, y:50};
        this.pauseButton.position = vec2(FIELD_SIZE+10, 0);
        this.addDrawable(this.pauseButton, settings.guiLayer);
        this.stopButton.size = {x:50, y:50};
        this.stopButton.position = vec2(FIELD_SIZE+70, 0);
        this.stopButton.load("./images/stopButton.png");
        this.addDrawable(this.stopButton, settings.guiLayer);
        this.startButton.size = vec2(250, 250);
        this.startButton.position = vec2(
            View.canvasWidth / 2 - this.startButton.size.x / 2,
            View.canvasHeight / 2 - this.startButton.size.y / 2); 
        this.startButton.load("./images/startButton.png");
        this.addDrawable(EnemyController);
    },
    initFPS : function() {
		this.fpsTextBox.position = { x: FIELD_SIZE+10, y: 50 };
		this.fpsTextBox.size = { x:100, y: 20 };
		this.fpsTextBox.font = "bold 14px Arial";
		this.fpsTextBox.color = "#FF0000";
		this.addDrawable(this.fpsTextBox, settings.guiLayer);
    },
    initCreditsText : function() {
		this.creditsTextBox.position = { x: FIELD_SIZE+10, y: 70 };
		this.creditsTextBox.size = { x:100, y: 20 };
		this.creditsTextBox.font = "bold 14px Arial";
		this.creditsTextBox.color = "#FF0000";
		this.addDrawable(this.creditsTextBox, settings.guiLayer);
    },
    initDykeHealth : function() {
		this.dykeHealthBox.position = { x: FIELD_SIZE+10, y: 90 };
		this.dykeHealthBox.size = { x:100, y: 20 };
		this.dykeHealthBox.font = "bold 14px Arial";
		this.dykeHealthBox.color = "#FF0000";
		this.addDrawable(this.dykeHealthBox, settings.guiLayer);
    },
    // Starts the main menu
    startMenu : function() {
        this.addDrawable(this.startButton);
    },
    // Starts the game
    gameStart : function() {
        console.log("Starting Heimeiden...");
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i].visible = true;
        }
        this.background.visible = true;
        this.pauseButton.visible = true;
        this.stopButton.visible = true;
        this.fpsTextBox.visible = true;
        this.creditsTextBox.visible = true;
        this.dykeHealthBox.visible = true;
        this.pauseButton.load("./images/pauseButton.png");
        this.active = true;
        this.dyke = this.spawnActor(vec2(0,0), Dyke);
        EnemyController.start();
        PlayerData.reset();
    },
    update : function() {
        this.fpsTextBox.text = "FPS: " + View.lastfps;
        if (!PlayerData.paused) {
            this.updateCredits();
        }
        this.creditsTextBox.text = "Credits: " + PlayerData.credits;
        this.dykeHealthBox.text = "Dyke HP: " + this.dyke.health;
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
        popupText(vec2(this.creditsTextBox.position.x + 60,
                       this.creditsTextBox.position.y - 20), "+" + credits);
    },
    // Stops the game
    gameStop : function() {
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i].reset();
            this.Lanes[i].visible = false;
        }
        for (var i=0; i<this.Actors.length; i++) {
            this.removeDrawable(this.Actors[i]);
        }
        for (var i=0; i<this.Popups.length; i++) {
            this.removeDrawable(this.Popups[i]);
        }
        this.Actors = new Array();
        this.background.visible = false;
        this.pauseButton.visible = false;
        this.stopButton.visible = false;
        this.fpsTextBox.visible = false;
        this.creditsTextBox.visible = false;
        this.dykeHealthBox.visible = false;
        this.active = false;
        EnemyController.stop();
        EnemyController.reset();
    },
    buildDefence : function(position) {
        if (PlayerData.credits >= settings.defenceBuildCost) {
            PlayerData.credits -= settings.defenceBuildCost;
            return this.spawnActor(position, ShootingDefence);
        } else {
            console.log("Not enough credits to build a defence!");
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
    countActors : function(actorName) {
        var count = 0;
        for (var i=0; i<this.Actors.length; i++) {
            if (this.Actors[i].name == actorName) {
                count++;
            }
        }
        return count;
    },
    lose : function() {
        console.log("You lost the game!");
        PlayerData.paused = true;
        PlayerData.endOfGame = true;
    }
});
Game.stopButton.onclick = function() {
    this.parent.gameStop();
    this.parent.startMenu();
}
Game.startButton.onclick = function() {
    this.parent.gameStart();
    this.parent.removeDrawable(this);
}
Game.pauseButton.onclick = function() {
    if (!PlayerData.endOfGame) {
        if (PlayerData.paused) {
            PlayerData.paused = false; 
            this.load("./images/pauseButton.png");
        } else if (!PlayerData.paused) {
            PlayerData.paused = true;
            this.load("./images/startButton.png");
        }
    }
}

// Contains data for the player
PlayerData = {
    paused : null,
    credits : null,
    endOfGame : null,
    creditsTimer : null,
    reset : function() {
        this.paused = false;
        this.credits = settings.startingCredits;
        this.endOfGame = false;
        this.creditsTimer = 0;
    }
};

// Draws fading text popup at given position
popupText = function(position, text) {
    var popupText = Model.Drawables.TextDrawable.clone();
    popupText.position = position.clone();
    popupText.font = "bold 24px Arial";
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
