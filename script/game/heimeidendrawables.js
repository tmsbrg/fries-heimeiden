//non-static object classes for Heimeiden here

Lane = Model.Drawables.BaseDrawable.clone();
Lane.extend({
    size : vec2(settings.tileSize.x*settings.tilesPerLane, settings.tileSize.y),
    lanePos : 0,
    setLanePos : function(pos) {
        this.position.y = this.size.y * pos;
        this.lanePos = pos;
    },
    onDrawInit : function() {
        for (var i=0; i<settings.tilesPerLane; i++) {
            tile = Tile.clone();
            tile.position.x += settings.tileSize.x * i;
            tile.color = (this.lanePos%2)?
                         ((i%2)?"#32be3d":"#25b231"):
                         ((i%2)?"#25b231":"#32be3d");
            this.addDrawable(tile);
        }
    }
});

Tile = Model.Drawables.RectangleDrawable.clone();
Tile.extend({
    size : settings.tileSize.clone()
});

Actor = Model.Drawables.RectangleDrawable.clone();
Actor.extend({
    size : settings.tileSize.clone(),
    direction : 0,
    speed : 0,
    update : function() {
        if(paused) {return;}
        if (this.direction || this.speed) {
            this.position.x += this.direction * this.speed * deltaTime;
        }

    }
});


Enemy = Actor.clone();
Enemy.extend({
    speed : 25,
    direction : LEFT
});
