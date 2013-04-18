/* Class Game contains all game objects and manages the game. Every object
in the game is eventually a child of Game. */
Game = Model.Drawables.BaseDrawable.clone();
Game.extend({
    position : settings.fieldPosition.clone(),
    Lanes : new Array(settings.lanes),
    Actors : new Array(),
    dyke : null,
    active : false,
    creditsTimer : 0,
    pauseButton : Model.Drawables.ButtonDrawable.clone(),
    startButton : Model.Drawables.ButtonDrawable.clone(),
    stopButton : Model.Drawables.ButtonDrawable.clone(),
    popupText : Model.Drawables.TextDrawable.clone(),
    fpsTextBox : Model.Drawables.TextDrawable.clone(),
    creditsTextBox : Model.Drawables.TextDrawable.clone(),
    dykeHealth : Model.Drawables.TextDrawable.clone(),
    // Initializes the game, should only be called once per load
    initialize : function() {
        this.initConstants();
        this.initSelf();
        this.initDrawables();
        PlayerData.reset();
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
        this.pauseButton.load("./images/pauseButton.png");
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
		this.dykeHealth.position = { x: FIELD_SIZE+10, y: 90 };
		this.dykeHealth.size = { x:100, y: 20 };
		this.dykeHealth.font = "bold 14px Arial";
		this.dykeHealth.color = "#FF0000";
		this.addDrawable(this.dykeHealth, settings.guiLayer);
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
        this.pauseButton.visible = true;
        this.stopButton.visible = true;
        this.fpsTextBox.visible = true;
        this.creditsTextBox.visible = true;
        this.dykeHealth.visible = true;
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
        this.dykeHealth.text = "Dyke HP: " + this.dyke.health;
    },
    updateCredits : function() {
        this.creditsTimer += deltaTime;
        if (this.creditsTimer >= settings.secondsToCreditUpdate) {
            this.creditsTimer = 0;
            PlayerData.credits += settings.creditsPerCreditUpdate;
        }
    },
    // Stops the game
    gameStop : function() {
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i].visible = false;
        }
        for (var i=0; i<this.Actors.length; i++) {
            this.removeDrawable(this.Actors[i]);
        }
        this.Actors = new Array();
        this.pauseButton.visible = false;
        this.stopButton.visible = false;
        this.fpsTextBox.visible = false;
        this.creditsTextBox.visible = false;
        this.dykeHealth.visible = false;
        this.active = false;
        EnemyController.stop();
        EnemyController.reset();
    },
    buildDefence : function(position) {
        if (PlayerData.credits >= settings.defenceBuildCost) {
            PlayerData.credits -= settings.defenceBuildCost;
            this.spawnActor(position, Defence);
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
    reset : function() {
        this.paused = false;
        this.credits = settings.startingCredits;
        this.endOfGame = false
    }
};

// Draws fading text popup at given position
popupText = function(position, text) {
    var popupText = Model.Drawables.TextDrawable.clone();
    popupText.position = position;
    popupText.font = "bold 24px Arial";
    popupText.color = "red";
    popupText.setText(text);
    popupText.timeout = settings.popupTimeout; 
    popupText.timeleft = popupText.timeout;
    popupText.speed = settings.popupSpeed;
    popupText.update = function() {
        this.position.y -= this.speed * deltaTime;
        this.timeleft -= deltaTime;
        this.alpha = popupText.timeleft / popupText.timeout;
        if (this.timeleft <= 0) {
            Model.removeDrawable(this);
        }
    }
    Model.addDrawable(popupText);
}

// Called by rendering engine when everything is loaded
initialize = function() {
        Game.initialize();
}
