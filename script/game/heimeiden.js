Game = Model.Drawables.BaseDrawable.clone();
Game.extend({
    PlayerData : {},
    position : settings.fieldPosition.clone(),
    Lanes : new Array(settings.lanes),
    // Initializes the lanes and adds the main objects to the drawables list
    initialize : function() {
        console.log("Starting Heimeiden...");
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i] = Lane.clone();
            this.Lanes[i].setLanePos(i);
            this.addDrawable(this.Lanes[i]);
        }
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
