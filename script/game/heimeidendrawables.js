
// Creates and maintains an array of tiles for a lane
Lane = Model.Drawables.BaseDrawable.clone();
Lane.extend({
    size : new vec2(settings.tileSize.x*settings.tilesPerLane, settings.tileSize.y),
    lanePos : 0,
    Tiles : new Array(settings.tilesPerLane),
    // sets its pixel position based on its lane position
    setLanePos : function(pos) {
        this.position.y = this.size.y * pos;
        this.lanePos = pos;
    },
    onDrawInit : function() {
        for (var i = settings.tilesPerLane-1; i > -1; i--) {
            this.Tiles[i] = Tile.clone();
            this.Tiles[i].position.x += settings.tileSize.x * i;
            this.Tiles[i].tileIndex = i;
            this.addDrawable(this.Tiles[i]);
        }
    },
    // makes Game create a defence on his lane at given x position
    buildBuilding : function(xpos, buildingObject) {
        return this.parent.buildBuilding(new vec2(xpos, this.position.y),
            buildingObject);
    },
    creditsPopupOnTile : function(xpos, amount, positive) {
        this.parent.creditsPopupOnTile(new vec2(xpos, this.position.y),
                                       amount,
                                       positive);
    },
    reset : function() {
        for (var i = this.Tiles.length-1; i > -1; i--) {
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

// Tile object, handles mouse clicks and building stuff on them
Tile = Model.Drawables.BaseDrawable.clone();
Tile.extend({
    size : settings.tileSize.clone(),
    tileIndex : null,
    platform : null,
    building : null,
    // Empties the Tile's references to its building and platform
    reset : function() {
        this.building = null;
        this.platform = null;
    },
    // handles building on the tile
    onclick : function () {
        if (!PlayerData.paused && PlayerData.selectedBuilding != null) {
            switch (PlayerData.selectedBuilding) {
            case Stone:
                this.buildStone();
                break;
            case Platform:
                this.buildPlatform();
                break;
            case RemoveDefence:
                this.removeDefence();
                break;
            default:
                this.buildDefault();
                break;
            }
        }
    },
    // checks if a stone can be built here and attempts to build it
    buildStone : function() {
        if (!this.building && !this.platform && this.tileIndex != 0) {
            this.building = this.parent.buildBuilding(this.position.x,
                PlayerData.selectedBuilding);
            if (this.building) {
                this.building.tile = this;
            }
        }
    },
    // checks if a platform can be built and attempts to build it
    buildPlatform : function() {
        if (!this.building && (this.tileIndex == 1 || 
            this.parent.getTile(this.tileIndex-1).platform) &&
            this.platform == null) {
            if ((this.platform = this.parent.buildBuilding(this.position.x,
                Platform)) != null) {
                this.platform.tile = this;
            }
        }
    },
    /* removes building if present, otherwise removes platform if present.
       returns part of the money */
    removeDefence : function() {
        var returnMoney = 0;
        if (this.building) {
            returnMoney = this.building.cost * settings.sellRate;
            this.building.die();
            this.building = null;
        } else if (this.platform) {
            returnMoney = this.platform.cost * settings.sellRate;
            this.platform.die();
            this.reset();
        }

        returnMoney = Math.round(returnMoney);

        if (returnMoney > 0) {
            Game.addCredits(returnMoney);
            this.parent.creditsPopupOnTile(this.position.x, returnMoney);
        }
    },
    // attempts to build any other kind of defence, assuming it needs a platform
    buildDefault : function() {
        if (!this.building && (this.tileIndex == 0 || this.platform)) {
            this.building = this.parent.buildBuilding(this.position.x,
                PlayerData.selectedBuilding);
            if (this.platform) {
                this.platform.building = this.building;
            }
        }
    }
});

ExtendedAnimation = Model.Drawables.AnimatedDrawable.clone();
ExtendedAnimation.extend({
    /* Takes animation base paths like ./animation/walk and loads the spritesheet
    ./animation/walk.png and settingst at ./animation/walk.json if it exists */
    addAnimationsWithJSON : function(animationArray) {
        len = animationArray.length;
        for (var i = 0; i < len; i++) {
            var anim = Model.Drawables.AnimationDrawable.clone();
            var json = loadJSON(animationArray[i] + ".json");
            anim.extend(json);
            anim.load(animationArray[i] + ".png");
            this.addAnimations(anim);
        }
    },
    /* Sync animation pause with global game pause */
    syncPause : function() {
        if(PlayerData.paused) {
            if (!this.currentAnimation.paused) {
                this.currentAnimation.paused = true;
            }
        } else {
            if (this.currentAnimation.paused) {
                this.currentAnimation.paused = false;
            }
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
    goDie : false,
    deathAnimation : -1, // animation(index) to play before dying, none if -1
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
        this.position = new vec2(centreX ?
                    this.position.x + (settings.tileSize.x-this.size.x)/2
                :   this.position.x,
                             centreY ?
                    this.position.y + (settings.tileSize.y-this.size.y)/2
                :   this.position.y);
    },
    calculateAbsoluteSpeed : function() {
        return this.speed * settings.tileSize.x;
    },
    // Returns a new vec2 object containing the amount of pixels to its centre
    calculateCentre : function() {
        return new vec2(this.size.x / 2 , this.size.y / 2);
    },
    // Calls this.onUpdate, moves if needed and checks collisions if moving
    update : function() {
        this.syncPause();
        if (PlayerData.paused) return;
        if (this.goDie) {
            this.goDie = false;
            this.die();
        } else {
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
        for (var i = this.actorList.length-1; i > -1; i--) {
            var ignore = false;
            if (this.actorList[i] == this) continue;
            for (var j = this.ignoreCollisions.length-1; j > -1; j--) {
                if (this.actorList[i].collisionTag === this.ignoreCollisions[j]) {
                    ignore = true;
                    break;
                }
            }
            if (ignore) continue;
            if (this.rayHitRect(new vec2(this.position.x + 
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
    /* Returns true if new vec2 object point is in rectangle with position
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
                if (this.deathAnimation == -1) {
                    this.die();
                } else {
                    this.showActorAnimation(this.deathAnimation);
                }
            }
            this.onChangeHealth();
        }
    },
    animatedDie : function() {
        if (this.deathAnimation >= 0) {
            this.showActorAnimation(this.deathAnimation);
            return 1;
        } else {
            this.die();
            return 0;
        }
    },
    /* calls the onDeath function and removes the actor from
    the actorlist and memory */
    die : function () {
        this.onDeath();
        if (this.actorList != null) {
            for (var i = this.actorList.length-1; i > -1; i--) {
                if (this.actorList[i] == this) {
                    this.actorList.splice(i, 1);
                    break;
                }
            }
        }
        this.parent.removeDrawable(this);
    },
    showActorAnimation : function(animation) {
        if (this.currentAnimationIndex === this.deathAnimation) return;

        this.showAnimation(animation);
    },
    onAnimationComplete : function(currentAnimation) {
        if (currentAnimation === this.deathAnimation) {
            this.goDie = true;
        } else {
            this.customOnAnimationComplete(currentAnimation);
        }
    },
    customOnAnimationComplete : function(currentAnimation) {
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
    size : new vec2(settings.paalwormSize.x*settings.tileSize.x,
                settings.paalwormSize.y*settings.tileSize.y),
    treasure : null,
    direction : LEFT,
    collisionTag : collisionEnemy,
    ignoreCollisions : [collisionEnemy, collisionDefence, collisionShell],
    attackTimer : 0,
    attackAnimation : 2,
    moveAnimationOffset : 0, /* Number between 0 and Math.PI*2 that is used to 
        synch the move animation with the movement speed */
    target : null,
    cooldown : settings.paalwormCooldown, // amount of seconds between attacks
    attritionTime : settings.paalwormAttritionTime, /* amount of seconds between 
        losing health automatically */
    attritionAmount : settings.paalwormAttritionAmount, /* amount of health lost
        every time by attrition */
    attritionTimer : null,
    onInit : function () {
        this.attritionTimer = this.attritionTime;
        this.centreOnTile(true, false);
        this.position.y += settings.tileSize.y * 0.05;
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

        this.absoluteSpeed = this.speed * 
            (Math.sin(this.currentAnimation._currentFrame /
                      this.currentAnimation.frameN * (2*Math.PI) + this.moveAnimationOffset) *
             0.5 + 0.5) * settings.tileSize.x;
    },
    onChangeHealth : function () {
        this.showActorAnimation(1);
    },
    onCollide : function (other) {
        if (this.attackTimer <= 0) {
            this.showActorAnimation(this.attackAnimation);
            this.setTarget(other);
            this.attackTimer = this.cooldown;
        }
    },
    customOnAnimationComplete : function() {
        switch (this.currentAnimationIndex) {
            case this.attackAnimation:
                if (this.target != null) {
                    this.attack(this.target);
                    this.setTarget(null);
                }
                this.showActorAnimation(0);
                break;
            case 1:
                this.showActorAnimation(0);
                break;
        }
    },
    setTarget : function(target) {
        this.target = target;
    },
    onDeath : function () {
        this.parent.spawnActor(new vec2(this.position.x + this.size.x/2
                                        - this.treasure.size.x/2,
                                    this.position.y + this.size.y/2
                                        - this.treasure.size.y/2),
                               this.treasure,
                               settings.shellLayer);
    }
});

WeakEnemy = Enemy.clone();
WeakEnemy.extend({
    health : settings.weakPaalwormHealth,
    damage : settings.weakPaalwormDamage,
    speed : settings.paalwormSpeed,
    moveAnimationOffset : Math.PI * 0.5,
    animations : ["./animation/paalworm_weak/move", "./animation/paalworm_weak/hit",
                  "./animation/paalworm_weak/attack"],
    onInit : function() {
        this.treasure = WeakTreasure;
        Enemy.onInit.apply(this);
    }
});

StrongEnemy = Enemy.clone();
StrongEnemy.extend({
    health : settings.strongPaalwormHealth,
    damage : settings.strongPaalwormDamage,
    speed : settings.paalwormSpeed,
    moveAnimationOffset : Math.PI,
    animations : ["./animation/paalworm_strong/move", "./animation/paalworm_strong/hit",
                  "./animation/paalworm_strong/attack"],
    onInit : function() {
        this.treasure = StrongTreasure;
        Enemy.onInit.apply(this);
    }
});

EnemyTypes = [WeakEnemy, StrongEnemy];

Defence = Actor.clone();
Defence.extend({
    name : "Defence",
    size : new vec2(settings.defenseSize.x*settings.tileSize.x,
                settings.defenseSize.y*settings.tileSize.y),
    animations : ["./animation/temp_defence"],
    collisionTag : collisionDefence,
    cooldown : settings.defenceCooldown,
    range : settings.defenceRange,
    cost : settings.defenceBuildCost,
    onInit : function () {
        this.centreOnTile(true, false);
        if (this.position.x < settings.tileSize.x) {
            this.position.x -= this.size.x / 4;
        }
    },
    // return true if an enemy is in range and on the same lane
    enemyInRange : function () {
        for (var i = this.actorList.length-1; i > -1; i--) {
            if (this.actorList[i].collisionTag == collisionEnemy && 
                this.rayHitRect(new vec2(this.position.x + this.size.x,
                        this.position.y + this.centre.y),
                    this.range * settings.tileSize.x,
                    this.actorList[i].position,
                    this.actorList[i].size)) {
                return true;
            }
        }
        return false;
    }
});

Stone = Defence.clone();
Stone.extend({
    animations : ["./animation/objects/rockblock/healthfull",
    "./animation/objects/rockblock/healthlost",
    "./animation/objects/rockblock/healthcritical",
    "./animation/objects/rockblock/break"],
    deathAnimation : 3,
    collisionTag : collisionStone,
    health : settings.stoneHealth,
    cost : settings.stoneBuldCost,
    tile : null,
    onInit : function() {
        this.centreOnTile(true, true);
    },
    onChangeHealth : function() {
        if (this.health < 0.3 * settings.dykeHealth) {
            this.showActorAnimation(2);
        } else if (this.health < 0.7 * settings.dykeHealth) {
            this.showActorAnimation(1);
        }
    },
    onDeath : function () {
        if (this.tile) {
            this.tile.reset();
        }
    }
});

Priest = Defence.clone();
Priest.extend({
    name : "Priest",
    cost : settings.priestBuildCost,
    animations : ["./animation/dominee/idle", "./animation/dominee/active",
        "./animation/dominee/die"],
    deathAnimation : 2,
    directions : [new vec2(-1,0), new vec2(0,1), new vec2(1,0), new vec2(0,-1)],
    tileXY : new vec2(0,0),
    onUpdate : function() {
        for (var i = this.directions.length-1; i > -1; i--) {
            this.buffAt(this.directions[i].x, this.directions[i].y);
        }
    },
    onDeath : function() {
        for (var i = this.directions.length-1; i > -1; i--) {
            this.unBuffAt(this.directions[i].x, this.directions[i].y);
        }
    },
    getBuffableAt : function(X, Y) {
        var tile =  this.parent.getTile(this.tileXY.x + X, this.tileXY.y + Y);
        if (tile != null && tile.building && tile.building.buff) {
            return tile.building;
        } else {
            return null;
        }
    },
    buffAt : function(X, Y) {
        var defence = this.getBuffableAt(X, Y);
        if (defence && !defence.isBuffed) {
            defence.buff();
        }
    },
    unBuffAt : function(X, Y) {
        var defence = this.getBuffableAt(X, Y);
        if (defence && defence.isBuffed) {
            defence.unBuff();
        }
    }
});

ShootingDefence = Defence.clone();
ShootingDefence.extend({
    animations : ["./animation/heimeid/idle", "./animation/heimeid/move",
    "./animation/heimeid/attack_wait", "./animation/heimeid/attack",
    "./animation/heimeid/die",
    "./animation/heimeid/idle_buffed", "./animation/heimeid/attack_buffed"],
    bullet : null,
    isBuffed : false,
    goSpawnBullet : false,
    attackAnimation : 3,
    buffedAttackAnimation : 6,
    asynchAnimation : 1,
    playAfterasynchAnimation : 0,
    deathAnimation : 4,
    attackTimer : 0,
    attackMode : false,
    maxAsynchTime : settings.defenceMaxAsynchTime,
    onInit : function() {
        this.bullet = Bullet;
        Defence.onInit.apply(this);
    },
    onUpdate : function() {
        // Handle attacking
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }
        if (this.enemyInRange()) {
            if (this.attackMode == false) {
                this.enterAttackMode();
            }
            if (this.attackTimer <= 0) {
                this.attack();
                this.attackTimer = this.cooldown;
            }
        } else if (this.attackMode == true) {
            this.exitAttackMode();
        }

        // Throw a stone if ready
        if (this.goSpawnBullet) {
            this.goSpawnBullet = false;
            var bul = this.parent.spawnActor(new vec2(
                    this.position.x + this.size.x - this.bullet.size.x/2,
                    this.position.y + this.size.y/3 - this.bullet.size.y/2),
                this.bullet,
                settings.bulletLayer);
            if (this.isBuffed) {
                bul.buff();
            }
            this.endAttack();
        }
    },
    enterAttackMode : function() {
        this.attackMode = true;
        this.goIdle();
    },
    exitAttackMode : function() {
        this.attackMode = false;
        this.goIdle();
    },
    attack : function () {
        if (this.isBuffed) {
            this.showActorAnimation(this.buffedAttackAnimation);
        } else {
            this.showActorAnimation(this.attackAnimation);
        }
    },
    endAttack : function() {
        this.goIdle();
    },
    customOnAnimationComplete : function(currentAnimation) {
        switch(currentAnimation) {
            case this.attackAnimation:
            case this.buffedAttackAnimation:
                this.goSpawnBullet = true;
                break;
            case this.asynchAnimation:
                this.showActorAnimation(this.playAfterasynchAnimation);
                break;
        }
    },
    asynchwait : function() {
        this.playAfterasynchAnimation = this.currentAnimationIndex;
        this.showActorAnimation(this.asynchAnimation);
        this.currentAnimation.frameN = 2;
        this.currentAnimation.secondsPerFrame = Math.random()*this.maxAsynchTime/2;
    },
    buff : function() {
        this.isBuffed = true;
        this.cooldown = settings.defenceBuffedCooldown;
        if(this.currentAnimationIndex == 0) {
            this.goIdle();
        }
    },
    unBuff : function() {
        this.isBuffed = false;
        this.cooldown = settings.defenseCooldown;
        if(this.currentAnimationIndex == 5) {
            this.goIdle();
        }
    },
    goIdle : function() {
        if (this.isBuffed) {
            this.showActorAnimation(5);
        } else {
            this.showActorAnimation(0);
        }
    }
});

// If the dyke is destroyed, the player loses
Dyke = Actor.clone();
Dyke.extend({
    name : "Dyke",
    size : new vec2(settings.tileSize.x, settings.tileSize.y * settings.lanes),
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
            this.showActorAnimation(2);
            this.dykeFloor.changeWaterLevel(2);
        } else if (this.health < 0.7 * settings.dykeHealth) {
            this.showActorAnimation(1);
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
    size : new vec2(settings.tileSize.x * settings.bulletSize,
                settings.tileSize.y * settings.bulletSize),
    animations : ["./animation/objects/stone", "./animation/objects/stone_buffed"],
    direction : RIGHT,
    poof : null,
    invulnerable : true,
    isBuffed : false,
    speed : settings.bulletSpeed,
    damage : settings.bulletDamage,
    collisionTag : collisionBullet,
    ignoreCollisions : [collisionDefault, collisionDefence, collisionPlatform,
                        collisionBullet, collisionShell, collisionStone],
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
        var poof = this.parent.spawnEffect(new vec2(this.position.x +
                                                settings.tileSize.x * 0.125, 
                                     this.position.y + settings.tileSize.y * 0.125),
                                this.poof);
        if (this.isBuffed) {
            poof.showAnimation(1);
        }
        this.die();
    },
    buff : function () {
        this.isBuffed = true;
        this.showActorAnimation(1);
        this.damage = settings.bulletBuffedDamage;
    }
});

// Gives player credits if clicked on
Treasure = Actor.clone();
Treasure.extend({
    name : "Treasure",
    ignoremouse : false,
    fadeShell : "",
    fadeCounter : 0,
    fadeTime : settings.shellFadeTime,
    collisionTag : collisionShell,
    invulnerable : true,
    worth : 2,
    solid : false,
    size : new vec2(settings.tileSize.x * settings.shellSize.x,
                settings.tileSize.y * settings.shellSize.y),
    onUpdate : function() {
        this.fadeCounter += deltaTime;
        this.currentAnimation.alpha = 1 - (this.fadeCounter / this.fadeTime);
        if (this.fadeCounter > this.fadeTime) {
            this.die();
        }
    },
    onhover : function() {
        if (!PlayerData.paused) {
            this.parent.addCredits(this.worth);
            popupText(new vec2(this.position.x + this.size.x/2,
                            this.position.y),
                            "+" + this.worth);
            popupImage(this.position, this.size, this.fadeShell);
            this.die();
        }
    },
    onclick : function () {
        this.onhover();
    }
});

WeakTreasure = Treasure.clone();
WeakTreasure.extend({
    worth : settings.weakShellWorth,
    animations : ["./animation/objects/shell_weak"],
    fadeShell : "./images/game/shell_weak_fade.png"
});

StrongTreasure = Treasure.clone();
StrongTreasure.extend({
    worth : settings.strongShellWorth,
    animations : ["./animation/objects/shell_strong"],
    fadeShell : "./images/game/shell_strong_fade.png"
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
            this.building.animatedDie();
        }
        if (this.tile) {
            this.tile.reset();
        }
    }
});

Effect = ExtendedAnimation.clone()
Effect.extend({
    name : "Effect",
    size : new vec2(settings.tileSize.x * 0.75, settings.tileSize.y * 0.75),
    animations : ["./animation/effects/poof", "./animation/effects/poof2"],
    onDrawInit : function() {
        this.addAnimationsWithJSON(this.animations);
        this.showAnimation(0);
    },
    update : function() {
        this.syncPause();
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
        this.supports.position = new vec2(0, settings.tileSize.y * 1.4);
        this.supports.size = new vec2(212, 632);
        this.addDrawable(this.supports);
    },
});

DykeFloor = Model.Drawables.BaseDrawable.clone();
DykeFloor.extend({
    size : new vec2(212, 984),
    ignoremouse : true,
    supports : Model.Drawables.SpriteDrawable.clone(),
    grass : Model.Drawables.SpriteDrawable.clone(),
    water : Model.Drawables.SpriteDrawable.clone(),
    onDrawInit : function() {
        this.grass.load("./images/game/dyke/grass.png");
        this.grass.size = this.size;
        this.addDrawable(this.grass);
        this.water.size = new vec2(212, 984);
        this.changeWaterLevel(0);
        this.addDrawable(this.water);
        this.supports.load("./images/game/dyke/supports_back.png");
        this.supports.size = new vec2(this.size.x, 353);
        this.addDrawable(this.supports);
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

BackgroundWaves = Model.Drawables.SpriteDrawable.clone();
BackgroundWaves.extend({
    size : new vec2(2106, 1306),
    alpha : 1,
    originPosition : null,
    radius : 108,
    rotationSpeed : settings.waveSpeed,
    currentRotation : 0,
    onDrawInit : function() {
        this.load("./images/game/water_waves.png");
        this.originPosition = {
            x : this.position.x - this.radius,
            y : this.position.y - this.radius
        }
    },
    update : function() {
        if (PlayerData.paused) return;
        this.currentRotation += this.rotationSpeed * deltaTime;
        if (this.rotationSpeed > 2 * Math.PI) {
            this.currentRotation = 0;
        }
        this.position = {
            x : this.originPosition.x + Math.sin(this.currentRotation) *
                this.radius,
            y : this.originPosition.y + Math.cos(this.currentRotation) *
                this.radius
        }
    }
});

BackgroundFish = Model.Drawables.SpriteDrawable.clone();
BackgroundFish.extend({
    name : "fish",
    alpha : 1,
    fishId : 0,
    ignoremouse : true,
    size : {x: 370, y: 131},
    speed : settings.fishSpeed,
    destination : 0,
    halfway : 0,
    disappearOffset : 40,
    onDrawInit : function() {
        this.load("./images/game/fish.png");
        this.destination = this.position.x - settings.fishMoveDistance;
        this.halfway = this.position.x - (settings.fishMoveDistance - this.disappearOffset) / 2;
    },
    update : function() {
        if (PlayerData.paused) return;

        this.alpha = settings.fishMaxAlpha -
                          (Math.abs(this.position.x - this.halfway) /
                              (this.halfway - this.destination - this.disappearOffset))
                          * settings.fishMaxAlpha;
        this.position.x = lerp(this.position.x, this.destination, this.speed);
        if (inRange(this.position.x, this.destination, this.disappearOffset)) {
            this.parent.removeFishWithId(this.fishId);
        }
    }
});

RemoveDefence = {};
