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
    // Initializes the game, should only be called once per load
    initialize : function() {
        this.size = vec2(View.canvasWidth, View.canvasHeight);
        Model.addDrawable(this);
        this.initializeDrawables();
        this.menu();
        PlayerData.paused = false;
    },
    // Starts the main menu
    menu : function() {
        this.addDrawable(this.startButton);
    },
    // Starts the game
    gameStart : function() {
        popupText(vec2(100, 100), "text");
        console.log("Starting Heimeiden...");
        this.initDyke();
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i].visible = true;
        }
        this.pauseButton.visible = true;
        this.stopButton.visible = true;
        this.spawnEnemy(random(this.Lanes.length-1));
    },
    // Initializes all static drawableObjects, should only be called once per load
    initializeDrawables : function() {
        this.pauseButton.visible = false;
        this.stopButton.visible = false;
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i] = Lane.clone();
            this.Lanes[i].setLanePos(i);
            this.Lanes[i].visible = false;
            this.addDrawable(this.Lanes[i]);
        }
        this.addDrawable(this.pauseButton);
        this.addDrawable(this.stopButton);
        this.pauseButton.size = {x:50, y:50};
        this.pauseButton.position = vec2(480, 0);
        this.pauseButton.load("./images/pauseButton.png");
        this.addDrawable(this.pauseButton);
        this.stopButton.size = {x:50, y:50};
        this.stopButton.position = vec2(550, 0);
        this.stopButton.load("./images/stopButton.png");
        this.addDrawable(this.stopButton);
        this.startButton.size = vec2(250, 250);
        this.startButton.position = vec2(
            View.canvasWidth / 2 - this.startButton.size.x / 2,
            View.canvasHeight / 2 - this.startButton.size.y / 2); 
        this.startButton.load("./images/startButton.png");
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
    },
    // Initializes the dyke
    initDyke : function() {
        var dyke = Dyke.clone();
        this.addActor(dyke);
    },
    // Spawns an enemy at lane index lane
    spawnEnemy : function(lane) {
        enemy = Enemy.clone();
        enemy.position.x = (settings.tilesPerLane-1) * settings.tileSize.x;
        enemy.position.y = lane * settings.tileSize.y;
        this.addActor(enemy);
    },
    spawnDefence : function (position) {
        defence = Defence.clone();
        defence.position = position.clone();
        this.addActor(defence);
    },
    addActor : function(actor) {
        this.Actors[this.Actors.length] = actor;
        actor.actorList = this.Actors;
        this.addDrawable(actor);
    }

});
Game.stopButton.onclick = function() {
    this.parent.gameStop();
    this.parent.menu();
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
