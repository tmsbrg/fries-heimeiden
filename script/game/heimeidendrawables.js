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
    name : "Actor",
    size : settings.tileSize.clone(),
    direction : 0,
    speed : 0,
    solid : true,
    actorList : null,
    update : function() {
        if(PlayerData.paused) {return;}
        if (this.direction && this.speed) {
            if (!this.checkCollide({x:this.calculateMove(), y:this.position.y})) {
                this.move();
            } else if (!this.solid) {
                this.move();
            }
        }
    },
    move : function() {
        this.position.x = this.calculateMove();
    },
    calculateMove : function() {
        return (this.position.x + this.direction * this.speed * deltaTime);
    },
    checkCollide : function(position, size) {
        if (this.actorList == null) return;
        if (position == null) position = this.position;
        if (size == null) size = this.size;
        var corners = [position,
            vec2(position.x, position.y + size.y),
            vec2(position.x + size.x, position.y + size.y),
            vec2(position.x + size.x, position.y)
        ];
        for (var i=0; i<this.actorList.length; i++) {
            if (this.actorList[i] == this) continue;
            for (var j=0; j<corners.length; j++) {
                if (this.pointInRect(corners[j], this.actorList[i].position,
                                     this.actorList[i].size)) {
                    this.actorList[i].onCollide(this);
                    this.onCollide(this.actorList[i]);
                    return this.actorList[i];
                }
            }
        }
        return null;
    },
    pointInRect : function(point, position, size) {
        return (point.x > position.x && point.x < position.x + size.x &&
                point.y > position.y && point.y < position.y + size.y);
    },
    onCollide : function(other) {
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
