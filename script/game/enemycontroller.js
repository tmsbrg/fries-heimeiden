EnemyController = Model.Drawables.BaseDrawable.clone();
EnemyController.extend({
    active : false,
    currentWave : 0,
    currentSubWave : 0,
    inWave : false,
    subWaves : null,
    maxEnemies : null,
    spawnInterval : null,
    waitBeforeWave : null,
    enemyPool : null,
    lastLane : null,
    spawnTimer : 0,
    waitTimer : 0,
    onDrawInit : function() {
        this.setNewWaveInfo();
    },
    update : function() {
        if (PlayerData.paused) return;
        if (this.inWave) {
            this.updateWave();
        } else {
            this.waitTimer += deltaTime;
            if (this.waitTimer > this.waitBeforeWave) {
                this.waitTimer = 0;
                this.startWave();
            }
        }
    },
    updateWave : function() {
        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            this.spawnTimer = random(this.spawnInterval.max,
                                     this.spawnInterval.min);
            if (this.parent.countActors(collisionEnemy) < this.maxEnemies) {
                var enemyToSpawn = this.getEnemyFromPool();
                if (enemyToSpawn != -1) {
                    var lane;
                    do {
                        lane = random(settings.lanes-1);
                    } while (this.lastLane == lane);
                    this.parent.spawnEnemy(lane, enemyToSpawn);
                    this.enemyPool[enemyToSpawn]--;
                    this.lastLane = lane;
                } else {
                    this.currentSubWave++;
                    if (this.currentSubWave >= this.subWaves.length) {
                        this.currentSubWave = 0;
                        this.endWave();
                    } else {
                        this.startSubWave();
                    }
                }
            }
        }
    },
    // returns a random active enemy type from the pool
    getEnemyFromPool : function() {
        var activeEnemyTypes = this.getNumberOfActiveEnemyTypes();
        if (activeEnemyTypes == 0) {
            return -1; // No enemies in pool
        }
        var enemy = random(activeEnemyTypes-1);
        return this.getActiveEnemy(enemy);
    },
    // returns the number of enemy types in the pool that are not empty
    getNumberOfActiveEnemyTypes : function() {
        var result = 0;
        for (var i = this.enemyPool.length-1; i > -1; i--) {
            if (this.enemyPool[i] > 0) {
                result++;
            }
        }
        return result;
    },
    // returns the enemy at index given by number, but ignoring inactive enemies
    getActiveEnemy : function(number) {
        var len = this.enemyPool.length;
        for (var i = 0; i < len; i++) {
            if (this.enemyPool[i] > 0) {
                if (number == 0) {
                    return i;
                }
                number--;
            }
        }
        console.log("EnemyController Error: Cannot find Active Enemy " + number);
        return -1;
    },
    // starts current wave
    startWave : function() {
        this.startSubWave();
        this.inWave = true;
    },
    /* ends current wave and loads info for next wave, or stops if there are no
       more waves */
    endWave : function() {
        this.inWave = false;
        this.spawnTimer = 0;
        this.currentWave++;
        GUI.newWave();
        if (this.currentWave < Waves.waves.length) {
            this.setNewWaveInfo();
            this.unlockDefences();
        } else {
            this.stop();
        }
    },
    /* unlocks defences given by wave */
    unlockDefences : function() {
        for (var i = this.unlockBuildings.length-1; i > -1; i--) {
            GUI.unlockBuilding(this.unlockBuildings[i]);
        }
    },
    // loads the current subwave's enemy pool
    startSubWave : function() {
        this.enemyPool = this.subWaves[this.currentSubWave].enemies.clone();
    },
    // loads wave information for current wave
    setNewWaveInfo : function() {
        this.setWaveVariable("maxEnemies");
        this.setWaveVariable("spawnInterval");
        this.setWaveVariable("waitBeforeWave");
        this.setWaveVariable("subWaves");
        this.setWaveVariable("unlockBuildings");
    },
    setWaveVariable : function(variable) {
        this[variable] = (Waves.waves[this.currentWave][variable] != null) ?
                            Waves.waves[this.currentWave][variable] :
                            settings["default" + variable.charAt(0).toUpperCase()
                                     + variable.substr(1)];
    },
    start : function() {
        this.active = true;
        this.unlockDefences();
    },
    stop : function() {
        this.active = false;
        this.parent.wavesFinished();
    },
    reset : function() {
        this.inWave = false;
        this.lastLane = null;
        this.spawnTimer = 0;
        this.waitTimer = 0;
        this.currentWave = 0;
        this.currentSubWave = 0;
        this.setNewWaveInfo();
    }
});

