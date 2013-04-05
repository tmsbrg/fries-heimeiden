Game = Model.Drawables.BaseDrawable.clone();
Game.extend({
    position : settings.fieldPosition.clone(),
    Lanes : new Array(settings.lanes),
    dyke: null,
    // Initializes the lanes and adds the main objects to the drawables list
    initialize : function() {
        console.log("Starting Heimeiden...");
        for (var i=0; i<this.Lanes.length; i++) {
            this.Lanes[i] = Lane.clone();
            this.Lanes[i].setLanePos(i);
            this.addDrawable(this.Lanes[i]);
        }
        this.initDyke();
        Model.addDrawable(this);
        this.spawnEnemy(random(settings.lanes-1));
    },

    // Initializes the dyke
    initDyke : function() {
        this.dyke = Dyke.clone();
        this.addDrawable(this.dyke);
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
