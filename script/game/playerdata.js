/* Contains player data to be reset on every play*/
PlayerData = {
    paused : null,
    credits : null,
    endOfGame : null,
    creditsTimer : null,
    selectedBuilding : null,
    audioEnabled : null,
    areWavesFinished : null,
    selectedBuilding : null,
    canBuild : null,
    finalCountDown : null,
    timeUntilNextFish : null,
    currentFishId : null,
    lost : null,
    giveCredits : null,
    timeUntilRestartMusic : null,
    /* called when the game gets started, sets all playerdata to initial values */
    reset : function() {
        this.paused = false;
        this.credits = settings.startingCredits;
        this.endOfGame = false;
        this.creditsTimer = 0;
        this.selectedBuilding = null;
        this.audioEnabled = true;
        this.areWavesFinished = false;
        this.selectedBuilding = null;
        this.canBuild = true;
        this.finalCountDown = INACTIVE;
        this.timeUntilNextFish = settings.fishSpawnRate.max;
        this.currentFishId = 0;
        this.lost = false;
        this.giveCredits = true;
        this.timeUntilRestartMusic = 0;
    }
};

