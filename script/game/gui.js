buildingSelectButton = Model.Drawables.ButtonDrawable.clone()
buildingSelectButton.extend({
});

GUIButton = Model.Drawables.ButtonDrawable.clone();
GUIButton.extend({
    basepath : "",
    setBasepath : function(basepath) {
        this.basepath = basepath;
        this.onmouseout(); // load base image
    },
    onhover : function() {
        this.load(this.basepath + "_selected.png");
    },
    onmouseout : function() {
        this.load(this.basepath + ".png");
    },
});

GUI = Model.Drawables.BaseDrawable.clone();
GUI.extend({
    size : {x: 1920, y: 1080},
    sideImage : Model.Drawables.SpriteDrawable.clone(),
    upImage : Model.Drawables.SpriteDrawable.clone(),

    startButton : Model.Drawables.ButtonDrawable.clone(),

    fpsTextBox : Model.Drawables.TextDrawable.clone(),
    creditsTextBox : Model.Drawables.TextDrawable.clone(),
    dykeHealthBox : Model.Drawables.TextDrawable.clone(),

    menuBar : Model.Drawables.ButtonDrawable.clone(),
    game : null,
    init : function() {
        this.game = Game;
        this.active = false;
        this.initHUD();
        this.initFPS();
        this.initCreditsText();
        this.initDykeHealth();
        this.initButtons();
        this.initMenuBar();
        Model.addDrawable(this);
    },
    initHUD : function() {
        this.sideImage.visible = false;
        this.sideImage.size = {x:224, y:1080};
        this.sideImage.load("./images/gui/hud_left.png");
        this.addDrawable(this.sideImage);
        this.upImage.visible = false;
        this.upImage.position.x = 222;
        this.upImage.size = {x:1699, y:98};
        this.upImage.load("./images/gui/hud_up.png");
        this.addDrawable(this.upImage);
    },
    initFPS : function() {
		this.fpsTextBox.position = { x: 867, y:13};
		this.fpsTextBox.size = { x:400, y: 20 };
		this.fpsTextBox.font = "bold 52px US_Sans";
		this.fpsTextBox.color = "#FE0000";
		this.addDrawable(this.fpsTextBox);
    },
    initCreditsText : function() {
		this.creditsTextBox.position = { x: 1615,
                                         y: 13 };
		this.creditsTextBox.size = { x:400, y: 20 };
		this.creditsTextBox.font = "bold 52px US_Sans";
		this.creditsTextBox.color = "#FEF500" ;
		this.addDrawable(this.creditsTextBox);
    },
    initDykeHealth : function() {
		this.dykeHealthBox.position = { x: 244,
                                        y: 14 };
		this.dykeHealthBox.size = { x:400, y: 20 };
		this.dykeHealthBox.font = "bold 52px US_Sans";
		this.dykeHealthBox.color = "#23F407";
		this.addDrawable(this.dykeHealthBox);
    },
    initButtons : function() {
        this.startButton.size = vec2(250, 250);
        this.startButton.position = vec2(
            View.canvasWidth / 2 - this.startButton.size.x / 2,
            View.canvasHeight / 2 - this.startButton.size.y / 2); 
        this.startButton.load("./images/startButton.png");
    },
    initMenuBar : function() {
        this.menuBar.visible = false;
        this.menuBar.load("./images/gui/menubar.png");
        this.menuBar.position = {x: 1860, y: 540 - this.menuBar.size.y / 2},
        Model.addDrawable(this.menuBar); // has to be clickable outside of GUI
    },
    // Starts the main menu
    startMenu : function() {
        this.addDrawable(this.startButton);
    },
    gameStart : function() {
        this.size.x = 1920 - settings.tileSize.x * settings.tilesPerLane;
        this.fpsTextBox.visible = true;
        this.creditsTextBox.visible = true;
        this.dykeHealthBox.visible = true;
        this.upImage.visible = true;
        this.sideImage.visible = true;
        this.menuBar.visible = true;
        this.removeDrawable(this.startButton);
        this.game.gameStart();
        this.menuBar.soundButton.updateBasepath();
    },
    gameStop : function() {
        this.size.x = 1920;
        this.fpsTextBox.visible = false;
        this.creditsTextBox.visible = false;
        this.dykeHealthBox.visible = false;
        this.upImage.visible = false;
        this.sideImage.visible = false;
        this.menuBar.visible = false;
        this.menuBar.reset();
        this.game.gameStop();
        this.startMenu();
    },
    update : function() {
        this.fpsTextBox.text = "FPS: " + View.lastfps;
        this.creditsTextBox.text = "F " + PlayerData.credits + ",-";
        this.dykeHealthBox.text = "HP: " + (this.game.dyke.health / settings.dykeHealth * 100) + "%";
    }
});

GUI.startButton.onclick = function() {
    this.parent.gameStart();
}

GUI.menuBar.extend({
    restartButton : GUIButton.clone(),
    instructionButton : GUIButton.clone(),
    stopButton : GUIButton.clone(),
    soundButton : GUIButton.clone(),
    size : {x: 679, y: 476},
    textPosition : {x: 83, y: 15},
    textSize : {x: 386, y:72},
    originPosition : null,
    destination : null,
    slidedOut : false,
    speed : settings.menuMoveSpeed,
    cursor : "pointer",
    gui : GUI,
    onDrawInit : function() {
        this.originPosition = this.position.clone();

        this.restartButton.setBasepath("./images/gui/menubar_buttons/restart");
        this.restartButton.size = this.textSize.clone();
        this.restartButton.position = vec2(this.textPosition.x,
            this.textPosition.y);
        this.addDrawable(this.restartButton);
        this.instructionButton.setBasepath(
            "./images/gui/menubar_buttons/instructions");
        this.instructionButton.size = this.textSize.clone();
        this.instructionButton.position = vec2(this.textPosition.x,
            this.textPosition.y + this.textSize.y);
        this.addDrawable(this.instructionButton);
        this.stopButton.setBasepath("./images/gui/menubar_buttons/stop");
        this.stopButton.size = this.textSize.clone();
        this.stopButton.position = vec2(this.textPosition.x,
            this.textPosition.y + this.textSize.y * 2);
        this.addDrawable(this.stopButton);
        this.soundButton.size = vec2(419, 81);
        this.soundButton.position = vec2(this.textPosition.x,
            this.textPosition.y + this.textSize.y * 5);
        this.addDrawable(this.soundButton);
        this.soundButton.audioMutedIcon = Model.Drawables.ButtonDrawable.clone();
        this.soundButton.audioMutedIcon.position = vec2(this.soundButton.size.x,
            -10);
        this.soundButton.audioMutedIcon.load(
            "./images/gui/menubar_buttons/mute.png");
        this.soundButton.audioMutedIcon.size = vec2(123, 105);
        this.soundButton.addDrawable(this.soundButton.audioMutedIcon);
    },
    onclick : function() {
        if (this.slidedOut) {
            this.slideIn();
            this.unPause();
            this.slidedOut = false;
        } else {
            this.slideOut();
            this.pause();
            this.slidedOut = true;
        }
    },
    slideOut : function() {
        this.destination = this.originPosition.x - this.size.x * 0.9;
    },
    slideIn : function() {
        this.destination = this.originPosition.x;
    },
    pause : function() {
        if (!PlayerData.endOfGame) {
            PlayerData.paused = true;
        }
    },
    unPause : function() {
        if (!PlayerData.endOfGame) {
            PlayerData.paused = false;
        }
    },
    update : function() {
        if (this.destination != null) {
            this.position.x = lerp(this.position.x, this.destination, this.speed);
            if (inRange(this.position.x, this.destination, 10)) {
                this.position.x = this.destination;
                this.destination = null;
            }
        }
    },
    reset : function() {
        this.destination = null;
        this.slidedOut = false;
        this.position = this.originPosition.clone();
    },
});

GUI.menuBar.stopButton.onclick = function() {
    this.parent.gui.gameStop();
}

GUI.menuBar.restartButton.onclick = function() {
    this.parent.gui.gameStop();
    this.parent.gui.gameStart();
}

GUI.menuBar.soundButton.updateBasepath = function() {
    if (PlayerData.audioEnabled) {
        this.setBasepath("./images/gui/menubar_buttons/sound_on");
        this.audioMutedIcon.visible = false;
    } else {
        this.setBasepath("./images/gui/menubar_buttons/sound_off");
        this.audioMutedIcon.visible = true;
    }
}

GUI.menuBar.soundButton.onclick = function() {
    PlayerData.audioEnabled = !PlayerData.audioEnabled;
    this.updateBasepath();
}
