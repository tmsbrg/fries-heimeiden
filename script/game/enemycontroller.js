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
            if (this.parent.countActors("Enemy") < this.maxEnemies) {
                if (this.enemyPool.Enemy > 0) {
                    var lane;
                    do {
                        lane = random(settings.lanes-1);
                    } while (this.lastLane == lane);
                    this.parent.spawnEnemy(lane);
                    this.enemyPool.Enemy--;
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
    startWave : function() {
        this.startSubWave();
        this.inWave = true;
    },
    endWave : function() {
        this.inWave = false;
        this.spawnTimer = 0;
        this.currentWave++;
        if (this.currentWave < Waves.waves.length) {
            this.setNewWaveInfo();
        } else {
            this.stop();
        }
    },
    startSubWave : function() {
        this.enemyPool = this.subWaves[this.currentSubWave].enemies.clone();
    },
    setNewWaveInfo : function() {
        this.setWaveVariable("maxEnemies");
        this.setWaveVariable("spawnInterval");
        this.setWaveVariable("waitBeforeWave");
        this.setWaveVariable("subWaves");
    },
    setWaveVariable : function(variable) {
        this[variable] = (Waves.waves[this.currentWave][variable] != null) ?
                            Waves.waves[this.currentWave][variable] :
                            settings["default" + variable.charAt(0).toUpperCase()
                                     + variable.substr(1)];
    },
    start : function() {
        this.active = true;
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
        this.setNewWaveInfo();
    }
});

