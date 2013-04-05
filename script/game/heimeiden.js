
Game = Model.Drawables.BaseDrawable.clone();
Game.extend({
    position : settings.fieldPosition.clone(),
    Lanes : new Array(settings.lanes),
    pauseButton : Model.Drawables.ButtonDrawable.clone(),
    startButton : Model.Drawables.ButtonDrawable.clone(),
    stopButton : Model.Drawables.ButtonDrawable.clone(),
    // Initializes the lanes and adds the main objects to the drawables list

    initialize : function() {
        this.size = vec2(View.canvasWidth, View.canvasHeight);
        Model.addDrawable(this);
        this.initializeDrawables();
        this.menu();
        PlayerData.paused = false;
    },
    menu : function() {
        this.startButton.size = vec2(250, 250);
        this.startButton.position = vec2(
            View.canvasWidth / 2 - this.startButton.size.x / 2,
            View.canvasHeight / 2 - this.startButton.size.y / 2); 
        console.log(this.startButton.position)
        this.startButton.load("./images/startButton.png");
        this.addDrawable(this.startButton);
    },
    gameStart : function() {
        console.log("Starting Heimeiden...");
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i].visible = true;
        }
        this.pauseButton.visible = true;
        this.stopButton.visible = true;
        this.spawnEnemy(0);
    },
       
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
    },

    gameStop : function() {
        console.log(this.pauseButton);
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i].visible = false;
        }
        this.pauseButton.visible = false;
        this.stopButton.visible = false;
    },
    // Spawns an enemy at lane index lane
    spawnEnemy : function(lane) {
        enemy = Enemy.clone();
        enemy.position.x = (settings.tilesPerLane-1) * settings.tileSize.x;
        this.Lanes[lane].addDrawable(enemy);
    }
});
Game.stopButton.onclick = function(){
    this.parent.gameStop();
    this.parent.menu();
}
Game.startButton.onclick = function(){
    this.parent.gameStart();
    console.log("start");
    this.parent.removeDrawable(this);
}
Game.pauseButton.onclick = function(){
    if(PlayerData.paused){PlayerData.paused = false;
    this.load("./images/pauseButton.png");}
    else if(!PlayerData.paused){PlayerData.paused = true;
    this.load("./images/startButton.png");}
}


PlayerData = {paused: null};
initialize = function() {
        Game.initialize();
}
