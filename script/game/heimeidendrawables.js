//non-static object classes for Heimeiden here

Lane = Model.Drawables.BaseDrawable.clone();
Lane.extend({
    size : vec2(settings.tileSize.x*settings.tilesPerLane, settings.tileSize.y),
    lanePos : 0,
    Tiles : new Array(settings.tilesPerLane),
    setLanePos : function(pos) {
        this.position.y = this.size.y * pos;
        this.lanePos = pos;
    },
    onDrawInit : function() {
        for (var i=0; i<settings.tilesPerLane; i++) {
            this.Tiles[i] = Tile.clone();
            this.Tiles[i].position.x += settings.tileSize.x * i;
            this.Tiles[i].color = (this.lanePos%2)?
                         ((i%2)?"#335dc0":"#294994"):
                         ((i%2)?"#294994":"#335dc0");
            this.addDrawable(this.Tiles[i]);
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
    solid : true,
    actorList : null,
    update : function() {
        if(PlayerData.paused) {return;}
        if (this.direction || this.speed) {
            this.position.x += this.direction * this.speed * deltaTime;
            if (this.solid) {
                this.checkCollide();
            }
        }
    },
    checkCollide : function() {
        if (this.actorList == null) return;

        //
    }
});


Enemy = Actor.clone();
Enemy.extend({
    speed : 25,
    direction : LEFT
});

Dyke = Actor.clone();
Dyke.extend({
    size : vec2(settings.tileSize.x, settings.tileSize.y * settings.lanes),
    color : 'yellow',
    alpha : 0.7
});
