buildingSelectButton = Model.Drawables.ButtonDrawable.clone()
buildingSelectButton.extend({
});

GUI = Model.Drawables.BaseDrawable.clone();
GUI.extend({
    size : {x: 1920, y: 1080},
    background : Model.Drawables.SpriteDrawable.clone(),
    pauseButton : Model.Drawables.ButtonDrawable.clone(),
    startButton : Model.Drawables.ButtonDrawable.clone(),
    stopButton : Model.Drawables.ButtonDrawable.clone(),
    fpsTextBox : Model.Drawables.TextDrawable.clone(),
    creditsTextBox : Model.Drawables.TextDrawable.clone(),
    dykeHealthBox : Model.Drawables.TextDrawable.clone(),
    game : null,
    init : function() {
        this.game = Game;
        this.active = false;
        this.initFPS();
        this.initCreditsText();
        this.initDykeHealth();
        this.initButtons();
        Model.addDrawable(this);
    },
    initFPS : function() {
		this.fpsTextBox.position = { x: 10, y:50};
		this.fpsTextBox.size = { x:100, y: 20 };
		this.fpsTextBox.font = "bold 14px Arial";
		this.fpsTextBox.color = "#FF0000";
		this.addDrawable(this.fpsTextBox, settings.guiLayer);
    },
    initCreditsText : function() {
		this.creditsTextBox.position = { x: 10,
                                         y: 70 };
		this.creditsTextBox.size = { x:100, y: 20 };
		this.creditsTextBox.font = "bold 14px Arial";
		this.creditsTextBox.color = "#FF0000";
		this.addDrawable(this.creditsTextBox, settings.guiLayer);
    },
    initDykeHealth : function() {
		this.dykeHealthBox.position = { x: 10,
                                        y: 90 };
		this.dykeHealthBox.size = { x:100, y: 20 };
		this.dykeHealthBox.font = "bold 14px Arial";
		this.dykeHealthBox.color = "#FF0000";
		this.addDrawable(this.dykeHealthBox, settings.guiLayer);
    },
    initButtons : function() {
        this.pauseButton.visible = false;
        this.stopButton.visible = false;
        this.pauseButton.size = {x:50, y:50};
        this.pauseButton.position = vec2(10, 0);
        this.addDrawable(this.pauseButton, settings.guiLayer);
        this.stopButton.size = {x:50, y:50};
        this.stopButton.position = vec2(70, 0);
        this.stopButton.load("./images/stopButton.png");
        this.addDrawable(this.stopButton, settings.guiLayer);
        this.startButton.size = vec2(250, 250);
        this.startButton.position = vec2(
            View.canvasWidth / 2 - this.startButton.size.x / 2,
            View.canvasHeight / 2 - this.startButton.size.y / 2); 
        this.startButton.load("./images/startButton.png");
    },
    // Starts the main menu
    startMenu : function() {
        this.addDrawable(this.startButton);
    },
    gameStart : function() {
        this.size.x = 1920 - settings.tileSize.x * settings.tilesPerLane;
        this.pauseButton.visible = true;
        this.stopButton.visible = true;
        this.fpsTextBox.visible = true;
        this.creditsTextBox.visible = true;
        this.dykeHealthBox.visible = true;
        this.pauseButton.load("./images/pauseButton.png");
        this.game.gameStart();
    },
    gameStop : function() {
        this.size.x = 1920;
        this.pauseButton.visible = false;
        this.stopButton.visible = false;
        this.fpsTextBox.visible = false;
        this.creditsTextBox.visible = false;
        this.dykeHealthBox.visible = false;
        this.game.gameStop();
    },
    update : function() {
        this.fpsTextBox.text = "FPS: " + View.lastfps;
        this.creditsTextBox.text = "Credits: " + PlayerData.credits;
        this.dykeHealthBox.text = "Dyke HP: " + this.game.dyke.health;
    }
});

GUI.stopButton.onclick = function() {
    this.parent.gameStop();
    this.parent.startMenu();
}
GUI.startButton.onclick = function() {
    this.parent.gameStart();
    this.parent.removeDrawable(this);
}
GUI.pauseButton.onclick = function() {
    if (!PlayerData.endOfGame) {
        if (PlayerData.paused) {
            PlayerData.paused = false; 
            this.load("./images/pauseButton.png");
        } else if (!PlayerData.paused) {
            PlayerData.paused = true;
            this.load("./images/startButton.png");
        }
    }
}
