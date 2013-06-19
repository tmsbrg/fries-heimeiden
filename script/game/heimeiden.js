/* Class Game contains all game objects and manages the game. Every non-gui object
in the game is eventually a child of Game. */
Game = Model.Drawables.BaseDrawable.clone();
Game.extend({
    position : settings.fieldPosition.clone(),
    Lanes : new Array(settings.lanes), /* array of lanes that contan all the tiles */
    Actors : new Array(), /* array that contains all the actors on the field */
    Popups : new Array(), /* array that contains all popups and
                             effects on the field */
    dyke : null, /* direct reference to the dyke actor */
    dykeObjects : [DykeFloor, DykeSupports, DykeShore], /* reference to objects
                            that are part of the dyke but behind other actors */

    active : false, /* do not start the update loop immediately */
    background : Model.Drawables.SpriteDrawable.clone(), /* the tiled water
                                                            background */
    waves : BackgroundWaves, /* the moving waves in the background */
    gui : GUI, /* direct reference to the GUI */

    backgroundMusic : null,

    /* array of objects to preload images of */
    preloadObjects : [FinalScreen, WeakEnemy, StrongEnemy, Stone, Priest,
                      ShootingDefence, Dyke, Bullet, WeakTreasure, StrongTreasure,
                      Platform, BackgroundFish, BackgroundWaves, DykeSupports,
                      DykeFloor, DykeShore],

    /* initializes the game, should only be called once per load */
    initialize : function() {
        this.preload();
        this.initSelf();
        this.initMusic();
        this.initDrawables();
        this.initGUI();
    },
    /* calls the preload function for each of the objects given by preloadObjects */
    preload : function() {
        for (i = this.preloadObjects.length-1; i > -1; i--) {
            this.preloadObjects[i].preload();
        }
        startPreload();
    },
    /* initializes own values */
    initSelf : function() {
        this.size = new vec2(View.canvasWidth, View.canvasHeight);
        Model.addDrawable(this);
    },
    /* initializes ambient background sound/music */
    initMusic : function() {
        this.backgroundMusic = AudioPlayer.clone();
        this.backgroundMusic.load("./audio/music.ogg");
    },
    /* initializes all static drawableObjects,
       should only be called once per load */
    initDrawables : function() {
        this.background.size = new vec2(settings.tileSize.x *
                                            (settings.tilesPerLane),
                                        settings.tileSize.y * settings.lanes);
        this.background.visible = false;
        this.background.alpha = 0.99;
        this.background.load("./images/game/water.png");
        this.addDrawable(this.background, settings.backgroundImageLayer);
        for (var i = this.Lanes.length-1; i > -1; i--) {
            this.Lanes[i] = Lane.clone();
            this.Lanes[i].setLanePos(i);
            this.Lanes[i].visible = false;
            this.addDrawable(this.Lanes[i], settings.groundLayer);
        }
        this.addDrawable(EnemyController);
        this.addDrawable(this.dykeObjects[0], settings.groundLayer);
        this.addDrawable(this.dykeObjects[1], settings.dykeLayer);
        this.addDrawable(this.dykeObjects[2], settings.shoreLayer);
        for (i = this.dykeObjects.length-1; i > -1; i--) {
            this.dykeObjects[i].visible = false;
        }
        this.waves.visible = false;
        this.addDrawable(this.waves, settings.wavesLayer);
    },
    /* initializes the GUI and starts the menu */
    initGUI : function() {
        this.gui.init();
        this.gui.menuStart();
    },
    /* starts the game */
    gameStart : function() {
        console.log("Starting Heimeiden...");
        for (var i = this.Lanes.length-1; i > -1; i--) {
            this.Lanes[i].visible = true;
        }
        for (i = this.dykeObjects.length-1; i > -1; i--) {
            this.dykeObjects[i].visible = true;
        }
        this.background.visible = true;
        this.waves.visible = true;
        this.active = true;
        this.dyke = this.spawnActor(new vec2(0,0), Dyke, settings.dykeLayer);
        this.gui.active = true;
        EnemyController.start();
        PlayerData.reset();
        this.dykeObjects[0].reset();
    },
    /* functions called constantly when the game is active */
    update : function() {
        this.syncAudioPause();
        PlayerData.timeUntilRestartMusic -= deltaTime;
        if (PlayerData.timeUntilRestartMusic <= 0) {
            this.backgroundMusic.play();
            PlayerData.timeUntilRestartMusic = random(settings.backgroundLoopInterval.max,
                                                      settings.backgroundLoopInterval.min);
        }
        if (!PlayerData.paused) {
            this.updateCredits();
            this.checkWin();
            this.checkEndOfGame();
            this.updateFish();
        }
    },
    syncAudioPause : function() {
        if (PlayerData.paused && !this.backgroundMusic.paused) {
            this.backgroundMusic.pause();
        } else if (!PlayerData.paused && PlayerData.audioEnabled &&
                   this.backgroundMusic.paused) {
            this.backgroundMusic.unpause();
        }
    },
    /* handles getting credits automatically over time */
    updateCredits : function() {
        if (!PlayerData.giveCredits) return;
        PlayerData.creditsTimer += deltaTime;
        if (PlayerData.creditsTimer >= settings.secondsToCreditUpdate) {
            PlayerData.creditsTimer = 0;
            this.addCredits(settings.creditsPerCreditUpdate);
        }
    },
    /* checks if the player has won the game */
    checkWin : function() {
        if (PlayerData.areWavesFinished &&
            PlayerData.finalCountDown == INACTIVE) {
            if (this.countActors(collisionEnemy) == 0) {
                this.win();
            }
        }
    },
    /* checks if the game has to be ended */
    checkEndOfGame : function() {
        if (PlayerData.finalCountDown > INACTIVE) {
            PlayerData.finalCountDown -= deltaTime;
            if (PlayerData.finalCountDown < 0) {
                this.endGame();
            }
        }
    },
    /* handles adding fishes once in a while */
    updateFish : function() {
        PlayerData.timeUntilNextFish -= deltaTime;
        if (PlayerData.timeUntilNextFish <= 0) {
            this.spawnFish();
            PlayerData.timeUntilNextFish = random(settings.fishSpawnRate.max,
                                                  settings.fishSpawnRate.min);
        }
    },
    /* adds given amount of credits to the player's credit count */
    addCredits : function(credits) {
        PlayerData.credits += credits;
    },
    /* stops the game */
    gameStop : function() {
        for (var i = this.Lanes.length-1; i > -1; i--) {
            this.Lanes[i].reset();
            this.Lanes[i].visible = false;
        }
        for (i = this.Actors.length-1; i > -1; i--) {
            this.removeDrawable(this.Actors[i]);
        }
        for (i = this.Popups.length-1; i > -1; i--) {
            this.removeDrawable(this.Popups[i]);
        }
        for (i = this.dykeObjects.length-1; i > -1; i--) {
            this.dykeObjects[i].visible = false;
        }
        this.Actors = new Array();
        this.Popups = new Array();
        this.background.visible = false;
        this.waves.visible = false;
        this.active = false;
        this.gui.active = false;
        PlayerData.areWavesFinished = false;
        EnemyController.stop();
        EnemyController.reset();
    },
    /* attempts to build buildingObject at given position, and substracts its cost
       from the player's treasury if the player has enough */
    buildBuilding : function(position, buildingObject) {
        if (!PlayerData.canBuild) return;
        if (PlayerData.credits >= buildingObject.cost) {
            PlayerData.credits -= buildingObject.cost;
            if (settings.deselectIconAfterBuild) {
                GUI.deselectBuilding();
            }
            layer = (position.x < this.dyke.position.x + this.dyke.size.x) ?
                        settings.backCharacterLayer :
                        settings.characterLayer;
            this.creditsPopupOnTile(position, buildingObject.cost, false);
            return this.spawnActor(position, buildingObject, layer);
        } else {
            console.log("Not enough credits to build this defence!");
            return null;
        }
    },
    /* makes a popup on tile at tilePosition for credit add/remove feedback */
    creditsPopupOnTile : function(tilePosition, amount, positive) {
        if (positive == null) {
            positive = true;
        }
        popupText(new vec2(settings.tileSize.x * 0.5,
                           settings.tileSize.y * 0.25).add(tilePosition),
                  (positive? "+" : "-") + amount,
                  (positive? null : "#FE0000"));
    },
    /* spawns enemy enemyNumber at given lane index */
    spawnEnemy : function(lane, enemyNumber) {
        this.spawnActor(new vec2((settings.tilesPerLane) * settings.tileSize.x,
                             lane * settings.tileSize.y),
                        EnemyTypes[enemyNumber]);
    },
    /* spawns given actor object at given position and layer,
       defaults to characterLayer */
    spawnActor : function (position, actorObject, layer) {
        if (layer == null) layer = settings.characterLayer;
        var actor = actorObject.clone();
        if (actor.name == "Priest") {
            actor.tileXY = new vec2(position.x / settings.tileSize.x,
                                position.y / settings.tileSize.y);
        }
        actor.position = position.clone();
        this.addActor(actor, layer);
        return actor;
    },
    /* spawns a fish at a random location in the water */
    spawnFish : function() {
        var fish = BackgroundFish.clone();
        fish.fishId = PlayerData.currentFishId;
        PlayerData.currentFishId++;
        fish.position.x = random(1920 - settings.fieldPosition.x - fish.size.x,
            fish.size.x + settings.fishMoveDistance + this.dyke.size.x);
        fish.position.y = random(1080 - settings.fieldPosition.y - fish.size.y,
            fish.size.y);
        this.addDrawable(fish, settings.fishLayer);
        this.Popups[this.Popups.length] = fish;
    },
    /* adds an actor to the field */
    addActor : function(actor, layer) {
        this.Actors[this.Actors.length] = actor;
        actor.actorList = this.Actors;
        this.addDrawable(actor, layer);
    },
    /* spawns effectobject at given position */
    spawnEffect : function(position, effectObject) {
        var effect = effectObject.clone();
        effect.position = new vec2(position.x - effectObject.size.x / 2,
                               position.y - effectObject.size.y / 2);
        this.addDrawable(effect, settings.effectLayer);
        this.Popups[this.Popups.length] = effect;
        return effect;
    },
    /* removes fish with given fishId */
    removeFishWithId : function(id) {
        for (var i=0; i<this.Popups.length; i++) {
            if (this.Popups[i].fishId == id) {
                this.removeDrawable(this.Popups[i]);
                this.Popups.splice(i, 1);
                return;
            }
        }
    },
    /* counts number of actors with given collision tags and returns it */
    countActors : function(collisionTag) {
        var count = 0;
        for (var i = this.Actors.length-1; i > -1; i--) {
            if (this.Actors[i].collisionTag == collisionTag) {
                count++;
            }
        }
        return count;
    },
    /* kills all defences on the field */
    killAllDefences : function() {
        this.killAllWithName("Platform");
        this.killAllWithName("Defence");
        this.killAllWithName("Priest");
    },
    /* kills all actors on the field whose name matches the one given */
    killAllWithName : function(name) {
        for (var i=0; i<this.Actors.length;) {
            if (this.Actors[i].name == name) {
                if (this.Actors[i].animatedDie()) {
                    i++;
                }
            } else {
                i++;
            }
        }
    },
    /* called when no more enemies will be spawned */
    wavesFinished : function() {
        PlayerData.areWavesFinished = true;
    },
    /* called when the player wins the game */
    win : function() {
        PlayerData.finalCountDown = settings.timeUntilFreeze;
    },
    /* called when the player loses the game */
    lose : function() {
        for (i = this.dykeObjects.length-1; i > -1; i--) {
            this.dykeObjects[i].visible = false;
        }
        this.killAllDefences();
        PlayerData.canBuild = false;
        PlayerData.lost = true;
        PlayerData.finalCountDown = settings.timeUntilFreeze;
    },
    /* freezes and ends the game */
    endGame : function() {
        PlayerData.paused = true;
        PlayerData.endOfGame = true;
        this.gui.endGame();
    },
    /* gets tile at given X and Y indexes */
    getTile : function(X, Y) {
        if (Y >= 0 && Y < this.Lanes.length) {
            return this.Lanes[Y].getTile(X);
        } else {
            return null;
        }
    }
});
