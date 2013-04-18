/* Class Game contains all game objects and manages the game. Every object
in the game is eventually a child of Game. */
Game = Model.Drawables.BaseDrawable.clone();
Game.extend({
    position : settings.fieldPosition.clone(),
    Lanes : new Array(settings.lanes),
    Actors : new Array(),
    dyke: null,
    pauseButton : Model.Drawables.ButtonDrawable.clone(),
    startButton : Model.Drawables.ButtonDrawable.clone(),
    stopButton : Model.Drawables.ButtonDrawable.clone(),
    popupText : Model.Drawables.TextDrawable.clone(),
    fpsTextBox : Model.Drawables.TextDrawable.clone(),
    // Initializes the game, should only be called once per load
    initialize : function() {
        this.initConstants();
        this.initSelf();
        this.initDrawables();
        this.initData();
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
		this.fpsTextBox.text = "FPS: " + View.lastfps;
		this.addDrawable(this.fpsTextBox, 101);
    },
    initData : function() {
        PlayerData.paused = false;
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
        this.spawnActor(vec2(0,0), Dyke);
        EnemyController.start();
    },
    update : function() {
        this.fpsTextBox.text = "FPS: " + View.lastfps;
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
        EnemyController.stop();
        EnemyController.reset();
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
    if (PlayerData.paused) {
        PlayerData.paused = false; 
        this.load("./images/pauseButton.png");
    } else if (!PlayerData.paused) {
        PlayerData.paused = true;
        this.load("./images/startButton.png");
    }
}

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
    spawnTimer : 0,
    waitTimer : 0,
    onDrawInit : function() {
        this.setNewWaveInfo();
    },
    update : function() {
        if (PlayerData.paused) return;
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
    updateWave : function() {
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            this.spawnTimer = random(this.spawnInterval.max,
                                     this.spawnInterval.min);
            if (this.parent.countActors("Enemy") < this.maxEnemies) {
                if (this.subWaves[this.currentSubWave].enemies.Enemy > 0) {
                    this.parent.spawnEnemy(random(settings.lanes-1));
                } else {
                    this.currentSubWave++;
                    if (this.currentSubWave > this.subWaves.length) {
                        this.currentSubWave = 0;
                        this.endWave();
                    }
                }
            }
        }
    },
    startWave : function() {
        this.inWave = true;
    },
    endWave : function() {
        this.inWave = false;
        this.spawnTimer = 0;
        currentWave++;
        if (currentWave < Waves.waves.length) {
            this.setNewWaveInfo();
        } else {
            this.stop();
        }
    },
    setNewWaveInfo : function() {
        this.setWaveVariable("maxEnemies");
        this.setWaveVariable("spawnInterval");
        this.setWaveVariable("waitBeforeWave");
        this.setWaveVariable("subWaves");
    },
    setWaveVariable : function(variable) {
        this[variable] = (Waves.waves[this.currentWave][variable] != null) ?
                            Waves.waves[this.currentWave][variable] :
                            settings["default" + variable.charAt(0).toUpperCase()
                                     + variable.substr(1)];
    },
    start : function() {
        this.active = true;
    },
    stop : function() {
        this.active = false;
    },
    reset : function() {
        this.inWave = false;
        this.active = true;
        this.spawnTimer = 0;
        this.waitTimer = 0;
        this.currentWave = 0;
        this.setNewWaveInfo();
    }
});

// Contains data for the player
PlayerData = {
    paused : null,
    credits : 0
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
