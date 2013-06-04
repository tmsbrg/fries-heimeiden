BuildingSelectButton = Model.Drawables.ButtonDrawable.clone()
BuildingSelectButton.extend({
    name : "buildingSelectButton",
    visible : false,
    building : null,
    baseImage : null,
    size : new vec2(170,170),
    onclick : function() {
        if (!PlayerData.paused) {
            if (PlayerData.selectedBuilding != this.building) {
                GUI.deselectBuilding();
                PlayerData.selectedBuilding = this.building;
                this.load(this.baseImage + "_selected.png");
            } else if (settings.canDeselectBuilding) {
                GUI.deselectBuilding();
                this.resetImage();
            }
        }
    },
    loadBase : function(src) {
        this.baseImage = src;
        this.resetImage();
    },
    resetImage : function() {
        if (this.curImage != this.baseImage + ".png") {
            this.load(this.baseImage + ".png");
        }
    }
});

GUIButton = Model.Drawables.ButtonDrawable.clone();
GUIButton.extend({
    basepath : "",
    setBasepath : function(basepath) {
        this.basepath = basepath;
        this.reset();
    },
    onhover : function() {
        this.load(this.basepath + "_selected.png");
    },
    onmouseout : function() {
        this.reset();
    },
    reset : function() {
        this.load(this.basepath + ".png");
    }
});

StartButton = GUIButton.clone();
StartButton.extend({
    basepath : "./images/gui/playbutton",
    onDrawInit : function() {
        this.onmouseout();
    },
    onclick : function() {
        this.parent.gameStart();
    },
});

InstructionScreen = Model.Drawables.BaseDrawable.clone();
InstructionScreen.extend({
    size : new vec2(1123, 842),
    screens : ["./images/gui/instructions/0.png",
        "./images/gui/instructions/1.png", "./images/gui/instructions/2.png"],
    screenObject : Model.Drawables.SpriteDrawable.clone(),
    previousButton : GUIButton.clone(),
    nextButton : GUIButton.clone(),
    onDrawInit : function() {
        this.position = new vec2(1920, 1080).add(
            new vec2(settings.fieldPosition.x, 0));
        this.position.divide(2);
        this.position.substract(new vec2(this.size).divide(2));

        this.screenObject.size = this.size;
        this.addDrawable(this.screenObject);

        this.previousButton.setBasepath("./images/gui/instructions/previous");
        this.previousButton.size = new vec2(430, 110);
        this.previousButton.position = new vec2(0, 842 - this.previousButton.size.y);
        this.previousButton.onclick = function() {
            this.parent.previousScreen();
        }
        this.addDrawable(this.previousButton);
        this.nextButton.setBasepath("./images/gui/instructions/next");
        this.nextButton.size = new vec2(430, 110);
        this.nextButton.position = new vec2(this.size).substract(this.nextButton.size);
        this.nextButton.onclick = function() {
            this.parent.nextScreen();
        }
        this.addDrawable(this.nextButton);
        this.reset();
    },
    loadScreen : function(number) {
        this.currentScreen = number;
        this.screenObject.load(this.screens[number]);
    },
    reset : function() {
        this.visible = false;
        this.loadScreen(0);
    },
    previousScreen : function() {
        if (this.currentScreen > 0) {
            this.loadScreen(this.currentScreen - 1);
        } else {
            console.log("InstructionScreen: Cannot go to previous screen, already at first screen!");
        }
    },
    nextScreen : function() {
        if (this.currentScreen < this.screens.length-1) {
            this.loadScreen(this.currentScreen + 1);
        } else {
            console.log("InstructionScreen: Cannot go to next screen, already at last screen!");
        }
    },
    show : function() {
        this.visible = true;
    },
    close : function() {
        this.reset();
    },
    toggle : function() {
        if (this.visible) {
            this.close();
        } else {
            this.show();
        }
    }
});

FinalScreen = Model.Drawables.ButtonDrawable.clone();
FinalScreen.extend({
    size : new vec2(1123, 842),
    winImage : "./images/gui/end/win.png",
    loseImage : "./images/gui/end/lose.png",
    onDrawInit : function() {
        this.position = new vec2(1920, 1080);
        this.position.divide(2);
        this.position.substract(new vec2(this.size).divide(2));
        this.close();
    },
    show : function() {
        if (PlayerData.lost) {
            this.load(this.loseImage);
        } else {
            this.load(this.winImage);
        }
        this.visible = true;
    },
    close : function() {
        this.visible = false;
    },
    onclick : function() {
        GUI.gameStop();
    }
});

GUI = Model.Drawables.BaseDrawable.clone();
GUI.extend({
    name : "GUI",
    size : {x: 1920, y: 1080},
    buildingSelectButtonY : 80,
    buildingSelectButtonX : 25,
    buildingSelectButtonSpace : 20,

    startscreenGUIElements : new Array(),
    inGameGUIElements : new Array(),

    startButton : null,

    wavesTextBox : null,
    creditsTextBox : null,
    dykeHealthBox : null,

    menuBar : null,
    buildingSelectButtons : new Array(),
    game : null,

    init : function() {
        this.game = Game;
        this.active = false;
        this.initSplash();
        this.initHUD();
        Model.addDrawable(this);
        Model.addDrawable(FinalScreen);
    },
    initSplash : function() {
        var splashscreen = Model.Drawables.SpriteDrawable.clone()
        splashscreen.load("./images/gui/splashscreen.png");
        splashscreen.size = new vec2(1920, 1080);
        this.addGUIElement(splashscreen, false);
    },
    initHUD : function() {
        var sideImage = Model.Drawables.SpriteDrawable.clone();
        sideImage.visible = false;
        sideImage.size = {x:224, y:1080};
        sideImage.load("./images/gui/hud_left.png");
        this.addGUIElement(sideImage);
        var upImage = Model.Drawables.SpriteDrawable.clone();
        upImage.visible = false;
        upImage.position.x = 222;
        upImage.size = {x:1699, y:98};
        upImage.load("./images/gui/hud_up.png");
        this.addGUIElement(upImage);

        this.initWavesText();
        this.initCreditsText();
        this.initDykeHealth();
        this.initButtons();
        this.initMenuBar();
    },
    initWavesText : function() {
        this.wavesTextBox = Model.Drawables.TextDrawable.clone();
		this.wavesTextBox.position = { x: 867, y:13};
		this.wavesTextBox.size = { x:400, y: 20 };
		this.wavesTextBox.font = "bold 52px US_Sans";
		this.wavesTextBox.color = "#FE0000";
		this.addGUIElement(this.wavesTextBox);
    },
    initCreditsText : function() {
        this.creditsTextBox = Model.Drawables.TextDrawable.clone();
		this.creditsTextBox.position = { x: 1615,
                                         y: 13 };
		this.creditsTextBox.size = { x:400, y: 20 };
		this.creditsTextBox.font = "bold 52px US_Sans";
		this.creditsTextBox.color = "#FEF500" ;
		this.addGUIElement(this.creditsTextBox);
    },
    initDykeHealth : function() {
        this.dykeHealthBox = Model.Drawables.TextDrawable.clone();
		this.dykeHealthBox.position = { x: 244,
                                        y: 14 };
		this.dykeHealthBox.size = { x:400, y: 20 };
		this.dykeHealthBox.font = "bold 52px US_Sans";
		this.dykeHealthBox.color = "#23F407";
		this.addGUIElement(this.dykeHealthBox);
    },
    initButtons : function() {
        this.startButton = StartButton;
        this.startButton.size = new vec2(250, 250);
        this.startButton.position = new vec2(
            View.canvasWidth / 2 - this.startButton.size.x / 2,
            View.canvasHeight / 2 - this.startButton.size.y * 0.7); 
        this.addGUIElement(this.startButton, false);
        this.addBuildingSelectButton(ShootingDefence, "./images/gui/icons/heimeid_stone");
        this.addBuildingSelectButton(Platform, "./images/gui/icons/platform");
        this.addBuildingSelectButton(Stone, "./images/gui/icons/stone");
        this.addBuildingSelectButton(Priest, "./images/gui/icons/dominee");
    },
    initMenuBar : function() {
        this.menuBar = MenuBar;
        this.menuBar.load("./images/gui/menubar.png");
        this.menuBar.position = {x: 1860, y: 540 - this.menuBar.size.y / 2};
        Model.addDrawable(this.menuBar); // has to be clickable outside of GUI space

        Model.addDrawable(InstructionScreen);
    },
    addGUIElement : function(element, ingame) {
        if (ingame == null) ingame = true;
        this.addDrawable(element);
        if (ingame) {
            this.inGameGUIElements[this.inGameGUIElements.length] = element;
        } else {
            this.startscreenGUIElements[this.startscreenGUIElements.length]
                = element;
        }
    },
    addBuildingSelectButton : function(building, image) {
        button = BuildingSelectButton.clone();
        button.building = building;
        button.loadBase(image);

        var yposition = (this.buildingSelectButtons.length) ? 
         this.buildingSelectButtons[this.buildingSelectButtons.length-1].position.y
           + BuildingSelectButton.size.y + this.buildingSelectButtonSpace
         : this.buildingSelectButtonY;

        button.position = {x: this.buildingSelectButtonX, y: yposition};
        this.addGUIElement(button);
        this.buildingSelectButtons[this.buildingSelectButtons.length] = button;
    },
    deselectBuilding : function() {
        PlayerData.selectedBuilding = null;
        for (var i = this.buildingSelectButtons.length-1; i > -1; i--) {
                this.buildingSelectButtons[i].resetImage();
        }
    },
    gameStart : function() {
        for (var i = this.inGameGUIElements.length-1; i > -1; i--) {
            this.inGameGUIElements[i].visible = true;
        }
        this.game.gameStart();
        this.menuBar.gameStart();
        this.buildingSelectButtons[0].onclick();
        this.menuStop();
    },
    gameStop : function() {
        for (var i = this.inGameGUIElements.length-1; i > -1; i--) {
            this.inGameGUIElements[i].visible = false;
        }
        this.menuBar.reset();
        InstructionScreen.reset();
        this.game.gameStop();
        this.menuBar.gameStop();
        this.menuStart();
        FinalScreen.close();
    },
    menuStart : function() {
        this.size.x = 1920;
        for (i = this.startscreenGUIElements.length-1; i > -1; i--) {
            this.startscreenGUIElements[i].visible = true;
        }
    },
    menuStop : function() {
        this.size.x = 1920 - settings.tileSize.x * settings.tilesPerLane;
        for (i = this.startscreenGUIElements.length-1; i > -1; i--) {
            this.startscreenGUIElements[i].visible = false;
        }
    },
    endGame : function() {
        FinalScreen.show();
    },
    update : function() {
        this.wavesTextBox.text = "WAVE " + (EnemyController.currentWave +
            !PlayerData.areWavesFinished) +
            "/" + Waves.waves.length;
        this.creditsTextBox.text = "F " + PlayerData.credits + ",-";
        this.dykeHealthBox.text = "DIJK: " + ((this.game.dyke.health <= 0) ? 0 :
            Math.round((this.game.dyke.health / settings.dykeHealth * 100))) + "%";
    }
});

MenuBar = Model.Drawables.ButtonDrawable.clone();
MenuBar.extend({
    visible : false,
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
        this.restartButton.position = new vec2(this.textPosition.x,
            this.textPosition.y);
        this.addDrawable(this.restartButton);
        this.instructionButton.setBasepath(
            "./images/gui/menubar_buttons/instructions");
        this.instructionButton.size = this.textSize.clone();
        this.instructionButton.position = new vec2(this.textPosition.x,
            this.textPosition.y + this.textSize.y);
        this.addDrawable(this.instructionButton);
        this.stopButton.setBasepath("./images/gui/menubar_buttons/stop");
        this.stopButton.size = this.textSize.clone();
        this.stopButton.position = new vec2(this.textPosition.x,
            this.textPosition.y + this.textSize.y * 2);
        this.addDrawable(this.stopButton);
        this.soundButton.size = new vec2(419, 81);
        this.soundButton.position = new vec2(this.textPosition.x,
            this.textPosition.y + this.textSize.y * 5);
        this.addDrawable(this.soundButton);
        this.soundButton.audioMutedIcon = Model.Drawables.ButtonDrawable.clone();
        this.soundButton.audioMutedIcon.position = new vec2(this.soundButton.size.x,
            -10);
        this.soundButton.audioMutedIcon.load(
            "./images/gui/menubar_buttons/mute.png");
        this.soundButton.audioMutedIcon.size = new vec2(123, 105);
        this.soundButton.addDrawable(this.soundButton.audioMutedIcon);
    },
    gameStart : function() {
        this.visible = true;
        this.soundButton.updateBasepath();
    },
    gameStop : function() {
        this.visible = false;
    },
    onclick : function() {
        if (PlayerData.finalCountDown != INACTIVE) return;
        if (this.slidedOut) {
            this.slideIn();
            InstructionScreen.close();
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

MenuBar.stopButton.onclick = function() {
    this.parent.gui.gameStop();
}

MenuBar.restartButton.onclick = function() {
    this.parent.gui.gameStop();
    this.parent.gui.gameStart();
}

MenuBar.soundButton.updateBasepath = function() {
    if (PlayerData.audioEnabled) {
        this.setBasepath("./images/gui/menubar_buttons/sound_on");
        this.audioMutedIcon.visible = false;
    } else {
        this.setBasepath("./images/gui/menubar_buttons/sound_off");
        this.audioMutedIcon.visible = true;
    }
}

MenuBar.soundButton.onclick = function() {
    PlayerData.audioEnabled = !PlayerData.audioEnabled;
    this.updateBasepath();
}

MenuBar.instructionButton.onclick = function() {
    InstructionScreen.toggle();
}
