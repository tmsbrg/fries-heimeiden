//non-static object classes for Heimeiden belong here

// Creates and maintains an array of tiles for its lane
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
    },
    spawnDefence : function(xpos) {
        this.parent.spawnDefence(vec2(xpos, this.position.y));
    }
});

// Stuff can be built on tiles
Tile = Model.Drawables.RectangleDrawable.clone();
Tile.extend({
    size : settings.tileSize.clone(),
    building : null,
    onclick : function () {
        this.parent.spawnDefence(this.position.x);
    }
});

/* The main type of object in the game. Actors can move around, have collision
detection, have health and some built in event functions. */
Actor = Model.Drawables.RectangleDrawable.clone();
Actor.extend({
    name : "Actor",
    size : settings.tileSize.clone(),
    centre: null,
    health : 2,
    invulnerable : false,
    direction : 0,
    speed : 0,
    solid : true,
    reach : 1,
    ignoreCollisions : [],
    actorList : null,
    onDrawInit : function() {
        this.onInit();
        this.centre = this.calculateCentre();
    },
    setSize : function(size) {
        this.size = size;
        this.centre = this.calculateCentre();
    },
    calculateCentre : function() {
        return vec2(this.size.x / 2 , this.size.y / 2);
    },
    update : function() {
        if (PlayerData.paused) return;
        this.onUpdate();
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
        for (var i=0; i<this.actorList.length; i++) {
            var ignore = false;
            if (this.actorList[i] == this) continue;
            for (var j=0; j<this.ignoreCollisions.length; j++) {
                if (this.actorList[i].name == this.ignoreCollisions[j]) {
                    ignore = true;
                    break;
                }
            }
            if (ignore) continue;
            if (this.lineInRect(vec2(this.position.x + 
                        ((this.direction==LEFT) ? 0 : this.size.x),
                        this.position.y + this.centre.y),
                    this.direction * this.reach,
                    this.actorList[i].position, this.actorList[i].size)) {
                this.actorList[i].onCollide(this);
                this.onCollide(this.actorList[i]);
                return this.actorList[i];
            }
        }
        return null;
    },
    pointInRect : function(point, rectPos, rectSize) {
        return (point.x > rectPos.x && point.x < rectPos.x + rectSize.x &&
                point.y >= rectPos.y && point.y <= rectPos.y + rectSize.y);
    },
    lineInRect : function(position, range, rectPos, rectSize) {
        return (position.y >= rectPos.y &&
                position.y <= rectPos.y + rectSize.y &&
                rectPos.x + rectSize.x - position.x >= range);
    },
    changeHealth : function (amount) {
        if (!this.invulnerable || amount > 0) {
            this.health += amount;
            if (this.health <= 0) {
                this.die();
            }
        }
    },
    die : function () {
        this.onDeath();
        if (this.actorList != null) {
            for (var i=0; i<this.actorList.length;i++) {
                if (this.actorList[i] == this) {
                    this.actorList.splice(i, 1);
                    break;
                }
            }
        }
        this.parent.removeDrawable(this);
    },
    onInit : function() {
    },
    onUpdate : function() {
    },
    onDeath : function() {
    },
    onCollide : function(other) {
    }
});


// Enemy moves to the left and attacks whatever defence or dyke comes in their way
Enemy = Actor.clone();
Enemy.extend({
    name : "Enemy",
    color : 'black',
    health : settings.paalwormHealth,
    damage : settings.paalwormDamage,
    speed : settings.paalwormSpeed,
    direction : LEFT,
    ignoreCollisions : [this.name],
    attackTimer : 0,
    cooldown : settings.paalwormCooldown,
    attritionTime : settings.paalwormAttritionTime,
    attritionAmount : settings.paalwormAttritionAmount,
    attritionTimer : null,
    onInit : function () {
        this.attritionTimer = this.attritionTime;
    },
    attack : function (other) {
        console.log(this.name + " attacks " + other.name + ". " + this.damage
                    + " damage.");
        other.changeHealth(-this.damage);
    },
    onUpdate : function () {
        this.attritionTimer -= deltaTime;
        if (this.attritionTimer <= 0) {
            this.changeHealth(-this.attritionAmount);
            this.attritionTimer = this.attritionTime;
        }
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }
    },
    onCollide : function (other) {
        if (this.attackTimer <= 0) {
            this.attack(other);
            this.attackTimer = this.cooldown;
        }
    },
    onDeath : function () {
        console.log(this.name + " died!");
    }
});

Defence = Actor.clone();
Defence.extend({
    name : "Defence",
    health : 4,
    alpha : 0.7,
    color : 'green',
    attackTimer : 0,
    cooldown : 1,
    range : 5,
    attack : function () {
        console.log("attack!");
    },
    // return true if an enemy is in range and on the same lane
    enemyInRange : function () {
        for (var i=0; i<this.actorList.length; i++) {
            if (this.actorList[i].name == "Enemy" && 
                this.lineInRect(vec2(this.position.x + this.centre.y,
                        this.position.y + this.centre.y),
                    this.range * settings.tileSize.x,
                    this.actorList[i].position, this.actorList[i].size)) {
                return true;
            }
        }
        return false;
    },
    onUpdate : function () {
        if (this.attackTimer > 0) {
            this.attacks -= deltaTime;
        }
        if (this.attackTimer <= 0 && this.enemyInRange()) {
            this.attack();
            this.attackTimer = this.cooldown;
        }
    }
});

// The dyke the player must defend
Dyke = Actor.clone();
Dyke.extend({
    name : "Dyke",
    size : vec2(settings.tileSize.x, settings.tileSize.y * settings.lanes),
    color : 'yellow',
    alpha : 0.7,
    health : 10,
    onDeath : function () {
        console.log(this.name + " breaks!");
    }
});
