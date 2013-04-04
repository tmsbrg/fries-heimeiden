Game = Model.Drawables.BaseDrawable.clone();
Game.extend({
    PlayerData : {},
    position : settings.fieldPosition.clone(),
    Lanes : new Array(5),
    // Initializes the lanes and adds the main objects to the drawables list
    initialize : function() {
        console.log("Starting Heimeiden...");
        foreach(this.Lanes, function(lane, i, caller) {
            lane = Lane.clone();
            lane.color = (i%2)?"#11FF11":"#00DD00";
            lane.setLanePos(i);
            caller.addDrawable(lane);
            caller.Lanes[i] = lane;
        }, this);
        Model.addDrawable(this);
        this.spawnEnemy(0);
    },
    // Spawns an enemy at lane index lane
    spawnEnemy : function(lane) {
        enemy = Enemy.clone();
        enemy.position.x = (settings.tilesPerLane-1) * settings.tileSize.x;
        this.Lanes[lane].addDrawable(enemy);
    }
});

initialize = function() {
    Game.initialize();
}
