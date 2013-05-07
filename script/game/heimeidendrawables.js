//non-static object classes for Heimeiden belong here

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
            this.Tiles[i].color = (this.lanePos%2)?
                         ((i%2)?"#335dc0":"#294994"):
                         ((i%2)?"#294994":"#335dc0");
            this.addDrawable(this.Tiles[i]);
        }
    },
    // makes Game create a defence on his lane at given x position
    buildDefence : function(xpos) {
        this.parent.buildDefence(vec2(xpos, this.position.y));
    }
});

// Stuff can be built on tiles
Tile = Model.Drawables.RectangleDrawable.clone();
Tile.extend({
    size : settings.tileSize.clone(),
    building : null,
    onclick : function () {
        if (!PlayerData.paused) {
            this.parent.buildDefence(this.position.x);
        }
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
    absoluteSpeed : 0,
    solid : true, // if false, it can move while colliding with objects
    reach : 1, // used for checking movement collisions
    ignoreCollisions : [], /* array of name tags of objects it won't check
                              collisions with */
    actorList : null, // list of actors to check collisions with
    onDrawInit : function() {
        this.absoluteSpeed = this.calculateAbsoluteSpeed();
        this.centre = this.calculateCentre();
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
                if (this.actorList[i].name == this.ignoreCollisions[j]) {
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
    }
});


// Enemy moves to the left and attacks whatever defence or dyke comes in their way
Enemy = Actor.clone();
Enemy.extend({
    name : "Enemy",
    color : 'brown',
    treasure : null,
    health : settings.paalwormHealth,
    damage : settings.paalwormDamage,
    speed : settings.paalwormSpeed,
    direction : LEFT,
    ignoreCollisions : ["Enemy", "Treasure"],
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
    health : settings.defenceHealth,
    alpha : 0.7,
    color : 'green',
    bullet : null,
    attackTimer : 0,
    cooldown : settings.defenceCooldown,
    range : settings.defenceRange,
    onInit : function () {
        this.bullet = Bullet;
    },
    attack : function () {
        this.parent.spawnActor(vec2(
                    this.position.x + this.size.x/2 - this.bullet.size.x/2,
                    this.position.y + this.size.y/2 - this.bullet.size.y/2),
                this.bullet,
                settings.bulletLayer);
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

// If the dyke is destroyed, the player loses
Dyke = Actor.clone();
Dyke.extend({
    name : "Dyke",
    size : vec2(settings.tileSize.x, settings.tileSize.y * settings.lanes),
    color : 'yellow',
    alpha : 0.7,
    health : settings.dykeHealth,
    onDeath : function () {
        console.log(this.name + " breaks!");
        this.parent.lose();
    }
});

// Moves to the right and wounds enemies on impact
Bullet = Actor.clone();
Bullet.extend({
    name : "Bullet",
    size : vec2(settings.tileSize.x * settings.bulletSizeInTiles,
                settings.tileSize.y * settings.bulletSizeInTiles),
    color : 'red',
    direction : RIGHT,
    invulnerable : true,
    speed : settings.bulletSpeed,
    damage : settings.bulletDamage,
    ignoreCollisions : ["Bullet", "Defence", "Treasure"],
    onUpdate : function() {
        if (this.position.x + this.size.x >= FIELD_SIZE) {
            this.die();
        }
    },
    onCollide : function (other) {
        other.changeHealth(-this.damage);
        this.die();
    }
});

// Gives player credits if clicked on
Treasure = Actor.clone();
Treasure.extend({
    name : "Treasure",
    color : 'purple',
    fadeCounter : 0,
    fadeTime : settings.shellFadeTime,
    alpha : 1,
    invulnerable : true,
    solid : false,
    size : vec2(settings.tileSize.x * settings.shellSizeInTiles,
                settings.tileSize.y * settings.shellSizeInTiles),
    onUpdate : function() {
        this.fadeCounter += deltaTime;
        this.alpha = 1 - (this.fadeCounter / this.fadeTime);
        if (this.fadeCounter > this.fadeTime) {
            this.die();
        }
    },
    onhover : function() {
        if (!PlayerData.paused) {
            this.parent.addCredits(settings.shellWorth);
            popupRect(this.position, this.size, this.color);
            this.die();
        }
    }
});

// Plays and manages audio
AudioPlayer = Model.Drawables.BaseDrawable.clone();
AudioPlayer.extend({
    audioList : new Array, // list of audio elements
    paused : false, // whether the current audio is paused or not
    currentAudio : null, // index number of current audio element
    /* Loads one or more files and puts them in its audio list.
    Files are given by relative filepath */
    load : function() {
        for (var i=0; i<arguments.length; i++) {
            if (typeof arguments[i] === 'string') {
                var audio = document.createElement('audio');
                audio.setAttribute('src', arguments[i]);
                this.audioList[this.audioList.length] = audio;
            } else {
                console.log("audioPlayer Error: arguments are not all strings");
                break;
            }
        }
    },
    /* Plays audio at index number number, Loops if loop is set to true.
    If no index number is given, it works as if 0 was given. */
    play : function(number, loop) {
        if (number==null) number = 0;
        if (number >= 0 && number < this.audioList.length) {
            if (this.currentAudio != null) {
                this.stop();
            }
            this.reset();
            this.currentAudio = number;
            if (loop == true) this.startLoop();
            this.audioList[number].play();
        } else {
            console.log("AudioPlayer Error: cannot play audio " + number + ", does not exist");
            return 1;
        }
    },
    /* Makes the current audio start from the beginning */
    restart : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].currentTime = 0;
    },
    /* Resets AudioPlayer variables, for when the current audio is stopped */
    reset : function() {
        this.paused = false;
    },
    /* Pauses the current audio */
    pause : function() {
        if (this.currentAudio == null) return;
        this.paused = true;
        this.audioList[this.currentAudio].pause();
    },
    /* Unpauses the current audio */
    unpause : function() {
        if (this.currentAudio == null) return;
        this.paused = false;
        this.audioList[this.currentAudio].play();
    },
    /* Stops the current audio and unselects it */
    stop : function() {
        if (this.currentAudio == null) return;
        this.pause();
        this.restart();
        this.currentAudio = null;
    },
    /* Mutes the current audio */
    mute : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].muted = true;
    },
    /* Unmutes the current audio */
    unmute : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].muted = false;
    },
    /* Makes the current audio into a loop */
    startLoop : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].setAttribute('loop', 'loop');
    },
    /* Removes the loop property from the current audio */
    endLoop : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].removeAttribute('loop');
    }
});
