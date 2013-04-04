//non-static object classes for Heimeiden here

Lane = Model.Drawables.RectangleDrawable.clone();
Lane.extend({
    size : vec2(settings.tileSize.x*settings.tilesPerLane, settings.tileSize.y),
    setLanePos : function(pos) {
        this.position.y = this.size.y * pos;
    },
    onDrawInit : function() {
        for (var i=0; i<settings.tilesPerLane; i++) {
            tile = Tile.clone();
            tile.position.x += settings.tileSize.x * i;
            tile.color = 'black';
            tile.alpha = (i%2)?0.06:0;
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
        this.position.x += this.direction * this.speed * deltaTime;
    }
});

Enemy = Actor.clone();
Enemy.extend({
    speed : 10,
    direction : LEFT
});
