
// Creates and maintains an array of tiles for a lane
Lane = Model.Drawables.BaseDrawable.clone();
Lane.extend({
    size : vec2(settings.tileSize.x*settings.tilesPerLane, settings.tileSize.y),
    lanePos : 0,
    Tiles : new Array(settings.tilesPerLane),
    // sets its pixel position based on its lane position
    setLanePos : function(pos) {
        this.position.y = this.size.y * pos;
        this.lanePos = pos;
    },
    onDrawInit : function() {
        for (var i=0; i<settings.tilesPerLane; i++) {
            this.Tiles[i] = Tile.clone();
            this.Tiles[i].position.x += settings.tileSize.x * i;
            this.Tiles[i].tileIndex = i;
            this.addDrawable(this.Tiles[i]);
        }
    },
    // makes Game create a defence on his lane at given x position
    buildBuilding : function(xpos, buildingObject) {
        return this.parent.buildBuilding(vec2(xpos, this.position.y),
            buildingObject);
    },
    reset : function() {
        for (var i=0; i<this.Tiles.length; i++) {
            this.Tiles[i].reset();
        }
    },
    getTile : function(tileIndex) {
        if (tileIndex >= 0 && tileIndex < this.Tiles.length) {
            return this.Tiles[tileIndex];
        } else {
            return null;
        }
    }
});

// Stuff can be built on tiles
Tile = Model.Drawables.BaseDrawable.clone();
Tile.extend({
    size : settings.tileSize.clone(),
    tileIndex : null,
    platform : null,
    building : null,
    reset : function() {
        this.building = null;
        this.platform = null;
    },
    onclick : function () {
        if (!PlayerData.paused && this.building == null) {
            if (this.tileIndex == 0 || this.platform) {
                this.building = this.parent.buildBuilding(this.position.x,
                    ShootingDefence);
                if (this.platform) {
                    this.platform.building = this.building;
                }
            } else if (this.tileIndex == 1 || 
                this.parent.getTile(this.tileIndex-1).platform) {
                this.platform = this.parent.buildBuilding(this.position.x,
                    Platform);
                this.platform.tile = this;
            }
        }
    }
});

ExtendedAnimation = Model.Drawables.AnimatedDrawable.clone();
ExtendedAnimation.extend({
    /* Takes animation base paths like ./animation/walk and loads the spritesheet
    ./animation/walk.png and settingst at ./animation/walk.json if it exists */
    addAnimationsWithJSON : function(animationArray) {
        for(var i=0;i<animationArray.length;i++) {
            var anim = Model.Drawables.AnimationDrawable.clone();
            var json = loadJSON(animationArray[i] + ".json");
            anim.extend(json);
            anim.load(animationArray[i] + ".png");
            this.addAnimations(anim);
        }
    },
});

/* The main type of object in the game. Actors can move around, have collision
detection, have health and some built in event functions. */
Actor = ExtendedAnimation.clone();
Actor.extend({
    name : "Actor",
    ignoremouse : true,
    size : settings.tileSize.clone(),
    centre: null,
    health : 2,
    invulnerable : false,
    direction : 0,
    speed : 0,
    absoluteSpeed : 0,
    animations : [],
    solid : true, // if false, it can move while colliding with objects
    reach : 1, // used for checking movement collisions
    collisionTag : collisionDefault,
    ignoreCollisions : [], /* array of collisionTags of objects it won't check
                              collisions with */
    actorList : null, // list of actors to check collisions with
    onDrawInit : function() {
        this.absoluteSpeed = this.calculateAbsoluteSpeed();
        this.centre = this.calculateCentre();
        this.addAnimationsWithJSON(this.animations);
        this.showAnimation(0);
        this.onInit();
    },
    // Sets its size and then recalculates its centre
    setSize : function(size) {
        this.size = size;
        this.centre = this.calculateCentre();
    },
    setSpeed : function(speed) {
        this.speed = speed;
        this.absoluteSpeed = this.calculateAbsoluteSpeed();
    },
    centreOnTile : function(centreX, centreY) {
        if (centreX == null) centreX = true;
        if (centreY == null) centreY = true;
        this.position = vec2(centreX ?
                    this.position.x + (settings.tileSize.x-this.size.x)/2
                :   this.position.x,
                             centreY ?
                    this.position.y + (settings.tileSize.y-this.size.y)/2
                :   this.position.y);
    },
    calculateAbsoluteSpeed : function() {
        return this.speed * settings.tileSize.x;
    },
    // Returns a vec2 object containing the amount of pixels to its centre
    calculateCentre : function() {
        return vec2(this.size.x / 2 , this.size.y / 2);
    },
    // Calls this.onUpdate, moves if needed and checks collisions if moving
    update : function() {
        if (PlayerData.paused) return;
        var other;
        this.onUpdate();
        if (this.direction && this.speed) {
            if (other = !this.checkCollide({x:this.calculateMove(),
                                            y:this.position.y})) {
                this.move();
            } else if (!this.solid || (other && !other.solid)) {
                this.move();
            }
        }
    },
    // Moves the Actor
    move : function() {
        this.position.x = this.calculateMove();
    },
    // Calculates its x position if it were to move now and returns it
    calculateMove : function() {
        return (this.position.x + this.direction * this.absoluteSpeed * deltaTime);
    },
    /* Checks collisions with all other actors of its actorList whose name tags
    aren't on the ignoreCollisions list */
    checkCollide : function(position) {
        if (this.actorList == null) return;
        if (position == null) position = this.position;
        for (var i=0; i<this.actorList.length; i++) {
            var ignore = false;
            if (this.actorList[i] == this) continue;
            for (var j=0; j<this.ignoreCollisions.length; j++) {
                if (this.actorList[i].collisionTag === this.ignoreCollisions[j]) {
                    ignore = true;
                    break;
                }
            }
            if (ignore) continue;
            if (this.rayHitRect(vec2(this.position.x + 
                        ((this.direction==LEFT) ? 0 : this.size.x),
                        this.position.y + this.centre.y),
                    this.direction * this.reach,
                    this.actorList[i].position, this.actorList[i].size)) {
                var other = this.actorList[i];
                other.onCollide(this);
                if (other) {
                    this.onCollide(other);
                }
                return other;
            }
        }
        return null;
    },
    /* Returns true if vec2 object point is in rectangle with position
    rectPos and size rectSize, false otherwise. */
    pointInRect : function(point, rectPos, rectSize) {
        return (point.x > rectPos.x && point.x < rectPos.x + rectSize.x &&
                point.y >= rectPos.y && point.y <= rectPos.y + rectSize.y);
    },
    /* Returns true if line starting from position, with range range intersects
    with rectangle with position rectPos and size rectSize */
    rayHitRect : function(position, range, rectPos, rectSize) {
        return (position.y >= rectPos.y &&
                position.y <= rectPos.y + rectSize.y &&
                ((range < 0) ? (rectPos.x + rectSize.x - position.x >= range &&
                                rectPos.x - position.x <= 0)
                             : (rectPos.x - position.x <= range &&
                                rectPos.x + rectSize.x - position.x >= 0)));
    },
    /* Changes health and makes actor die if health goes below 0, ignores negative
    values if actor is invulnerable */
    changeHealth : function (amount) {
        if (!this.invulnerable || amount > 0) {
            this.health += amount;
            if (this.health <= 0) {
                this.die();
            }
            this.onChangeHealth();
        }
    },
    /* calls the onDeath function and removes the actor from
    the actorlist and memory */
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
    // called when the actor is added to the field
    onInit : function() {
    },
    // called every frame
    onUpdate : function() {
    },
    // called on death
    onDeath : function() {
    },
    // called on collision with an object
    onCollide : function(other) {
    },
    // called when health is gained or lost with the changeHealth function
    onChangeHealth : function() {
    }
});


// Enemy moves to the left and attacks whatever defence or dyke comes in their way
Enemy = Actor.clone();
Enemy.extend({
    name : "Enemy",
    size : vec2(settings.paalwormSize.x*settings.tileSize.x,
                settings.paalwormSize.y*settings.tileSize.y),
    treasure : null,
    health : settings.paalwormHealth,
    damage : settings.paalwormDamage,
    speed : settings.paalwormSpeed,
    direction : LEFT,
    collisionTag : collisionEnemy,
    ignoreCollisions : [collisionEnemy, collisionDefence, collisionShell],
    animations : ["./animation/paalworm/move"],
    attackTimer : 0,
    cooldown : settings.paalwormCooldown, // amount of seconds between attacks
    attritionTime : settings.paalwormAttritionTime, /* amount of seconds between 
    losing health automatically */
    attritionAmount : settings.paalwormAttritionAmount, /* amount of health lost
    every time by attrition */
    attritionTimer : null,
    onInit : function () {
        this.treasure = Treasure;
        this.attritionTimer = this.attritionTime;
        this.centreOnTile();
    },
    // attacks given actor
    attack : function (other) {
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
        this.parent.spawnActor(vec2(this.position.x + this.size.x/2
                                        - this.treasure.size.x/2,
                                    this.position.y + this.size.y/2
                                        - this.treasure.size.y/2),
                               this.treasure,
                               settings.shellLayer);
    }
});

Defence = Actor.clone();
Defence.extend({
    name : "Defence",
    size : vec2(settings.defenseSize.x*settings.tileSize.x,
                settings.defenseSize.y*settings.tileSize.y),
    animations : ["./animation/temp_defence"],
    attackTimer : 0,
    collisionTag : collisionDefence,
    cooldown : settings.defenceCooldown,
    range : settings.defenceRange,
    cost : settings.defenceBuildCost,
    onInit : function () {
        this.bullet = Bullet;
        this.centreOnTile(true, false);
    },
    attack : function () {
    },
    // return true if an enemy is in range and on the same lane
    enemyInRange : function () {
        for (var i=0; i<this.actorList.length; i++) {
            if (this.actorList[i].name == "Enemy" && 
                this.rayHitRect(vec2(this.position.x + this.size.x,
                        this.position.y + this.centre.y),
                    this.range * settings.tileSize.x,
                    this.actorList[i].position,
                    this.actorList[i].size)) {
                return true;
            }
        }
        return false;
    },
    onUpdate : function () {
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }
        if (this.attackTimer <= 0 && this.enemyInRange()) {
            this.attack();
            this.attackTimer = this.cooldown;
        }
    },
    onDeath : function () {
        console.log(this.name + " has been destroyed!");
    }
});

ShootingDefence = Defence.clone();
ShootingDefence.extend({
    animations : ["./animation/heimeid/idle", "./animation/heimeid/move",
    "./animation/heimeid/attack", "./animation/heimeid/die"],
    bullet : null,
    attack : function () {
        this.parent.spawnActor(vec2(
                    this.position.x + this.size.x/2 - this.bullet.size.x/2,
                    this.position.y + this.size.y/2 - this.bullet.size.y/2),
                this.bullet,
                settings.bulletLayer);
    }
});

// If the dyke is destroyed, the player loses
Dyke = Actor.clone();
Dyke.extend({
    name : "Dyke",
    size : vec2(settings.tileSize.x, settings.tileSize.y * settings.lanes),
    animations : ["./animation/objects/dyke/healthfull",
                  "./animation/objects/dyke/healthlost",
                  "./animation/objects/dyke/healthcritical"],
    dykeFloor : null,
    dykeSupports : null,
    health : settings.dykeHealth,
    onInit : function() {
        this.dykeFloor = DykeFloor;
        this.dykeSupports = DykeSupports;
    },
    onChangeHealth : function() {
        if (this.health < 0.3 * settings.dykeHealth) {
            this.showAnimation(2);
            this.dykeFloor.changeWaterLevel(2);
        } else if (this.health < 0.7 * settings.dykeHealth) {
            this.showAnimation(1);
            this.dykeFloor.changeWaterLevel(1);
        }
    },
    onDeath : function () {
        console.log(this.name + " breaks!");
        this.dykeFloor.visible = false;
        this.dykeSupports.visible = false;
        this.parent.lose();
    }
});

// Moves to the right and wounds enemies on impact
Bullet = Actor.clone();
Bullet.extend({
    name : "Bullet",
    size : vec2(settings.tileSize.x * settings.bulletSize,
                settings.tileSize.y * settings.bulletSize),
    animations : ["./animation/objects/stone"],
    direction : RIGHT,
    poof : null,
    invulnerable : true,
    speed : settings.bulletSpeed,
    damage : settings.bulletDamage,
    collisionTag : collisionBullet,
    ignoreCollisions : [collisionDefault, collisionDefence, collisionPlatform,
                        collisionBullet, collisionShell],
    onInit : function() {
        this.poof = Effect;
    },
    onUpdate : function() {
        if (this.position.x + this.size.x >= FIELD_SIZE) {
            this.die();
        }
    },
    onCollide : function (other) {
        other.changeHealth(-this.damage);
        this.parent.spawnEffect(this.position, this.poof);
        this.die();
    }
});

// Gives player credits if clicked on
Treasure = Actor.clone();
Treasure.extend({
    name : "Treasure",
    ignoremouse : false,
    fadeCounter : 0,
    animations : ["./animation/objects/shell"],
    fadeTime : settings.shellFadeTime,
    collisionTag : collisionShell,
    invulnerable : true,
    solid : false,
    size : vec2(settings.tileSize.x * settings.shellSize.x,
                settings.tileSize.y * settings.shellSize.y),
    onInit : function() {
    },
    onUpdate : function() {
        this.fadeCounter += deltaTime;
        this.currentAnimation.alpha = 1 - (this.fadeCounter / this.fadeTime);
        if (this.fadeCounter > this.fadeTime) {
            this.die();
        }
    },
    onhover : function() {
        if (!PlayerData.paused) {
            this.parent.addCredits(settings.shellWorth);
            popupImage(this.position, this.size, "./images/game/shell_fade.png");
            this.die();
            popupText(vec2(this.position.x + this.size.x/2,
                            this.position.y + this.size.y/2),
                            "+" + settings.shellWorth);
        }
    },
    onclick : function () {
        this.onhover();
    }
});

Platform = Actor.clone()
Platform.extend({
    name : "Platform",
    animations : ["./animation/objects/platform"],
    health : settings.platformHealth,
    building : null,
    tile : null,
    collisionTag : collisionPlatform,
    cost : settings.platformBuildCost,
    onDeath : function () {
        if (this.building) {
            this.building.die();
        }
        if (this.tile) {
            this.tile.reset();
        }
    }
});

Effect = ExtendedAnimation.clone()
Effect.extend({
    name : "Effect",
    size : settings.tileSize.clone(),
    animations : ["./animation/effects/poof"],
    onDrawInit : function() {
        this.addAnimationsWithJSON(this.animations);
        this.showAnimation(0);
    },
    onAnimationComplete : function(currentAnimation) {
        this.parent.removeDrawable(this);
    }
});

DykeSupports = Model.Drawables.BaseDrawable.clone();
DykeSupports.extend({
    supports : Model.Drawables.SpriteDrawable.clone(),
    onDrawInit : function() {
        this.supports.load("./images/game/dyke/supports_front.png");
        this.supports.position = vec2(0, settings.tileSize.y * 2.5);
        this.supports.size = vec2(212, 344);
        this.addDrawable(this.supports);
    },
});

DykeFloor = Model.Drawables.BaseDrawable.clone();
DykeFloor.extend({
    size : vec2(212, 984),
    ignoremouse : true,
    supports : Model.Drawables.SpriteDrawable.clone(),
    grass : Model.Drawables.SpriteDrawable.clone(),
    water : Model.Drawables.SpriteDrawable.clone(),
    onDrawInit : function() {
        this.grass.load("./images/game/dyke/grass.png");
        this.grass.size = this.size;
        this.addDrawable(this.grass);
        this.supports.load("./images/game/dyke/supports_back.png");
        this.supports.size = vec2(this.size.x, 558);
        this.addDrawable(this.supports);
        this.water.size = vec2(212, 984);
        this.changeWaterLevel(0);
        this.addDrawable(this.water);
    },
    changeWaterLevel : function(newLevel) {
        if (newLevel > 2 || newLevel < 0) return;
        if (newLevel == 2) {
            this.water.visible = true;
            this.water.load("./images/game/dyke/water_02.png");
        } else if (newLevel == 1) {
            this.water.visible = true;
            this.water.load("./images/game/dyke/water_01.png");
        } else {
            this.water.visible = false;
        }
    },
    reset : function() {
        this.changeWaterLevel(0);
    }
});
