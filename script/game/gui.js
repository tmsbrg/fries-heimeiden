/* Button used to select what to build */
BuildingSelectButton = Model.Drawables.ButtonDrawable.clone()
BuildingSelectButton.extend({
    visible : false,
    building : null, /* building object bound to this button */
    baseImage : null, /* part of image path from which to get the unselected
                         version of the image and the selected version */
    lockedImage : "./images/gui/icons/lock.png",
    costText : null,
    locked : true,
    selected : false,
    grey : false,
    size : new vec2(170,170),

    /* initialize cost text, assume building is already given */
    onDrawInit : function() {
        if (this.building != RemoveDefence) {
            this.costText = Model.Drawables.TextDrawable.clone();
            this.costText.size = new vec2(50, 20);
            this.costText.position = new vec2(40,
                                              this.size.y - 30);
            this.costText.font = "bold 52px US_Sans";
            this.costText.color = "#FEF500";
            this.costText.borderWidth = 2;
            this.costText.borderColor = 'black';
            this.costText.setText("F " + this.building.cost + ".-");
            this.addDrawable(this.costText);
        }
    },
    /* deselect any other selected building and select ours */
    onmousedown : function() {
        if (!PlayerData.paused && !this.locked) {
            if (PlayerData.selectedBuilding != this.building) {
                GUI.deselectBuilding();
                PlayerData.selectedBuilding = this.building;
                this.selected = true;
                this.updateImage();
            } else if (settings.canDeselectBuilding) {
                GUI.deselectBuilding();
                this.selected = false;
                this.updateImage();
            }
        }
    },
    /* load a baseImage and set current image to the unselected version */
    loadBase : function(src) {
        this.baseImage = src;
        this.updateImage();
    },
    /* show the unselected version of the image */
    deselect : function() {
        if (this.selected) {
            this.selected = false;
            this.updateImage();
        }
    },
    /* update image to use */
    updateImage : function() {
        if (!this.locked) {
            this.load(this.baseImage +
                        (this.selected? "_selected" : "") +
                        (this.grey? "_grey" : "") +
                        ".png");
        } else {
            this.load(this.lockedImage);
        }
    },
    /* check if the player has enough money and update image accordingly */
    update : function() {
        if (this.building.cost > PlayerData.credits) {
            if (!this.grey) {
                this.grey = true;
                this.updateImage();
            }
        } else {
            if (this.grey) {
                this.grey = false;
                this.updateImage();
            }
        }
    },
    /* unlocks the button */
    unlock : function() {
        this.locked = false;
        this.updateImage();
    }
});

/* GUIButton is used for all buttons in the GUI that have a special onhover
   version */
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

/* The button that starts the game */
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

/* Contains a number of pages of instructions for the player */
InstructionScreen = Model.Drawables.BaseDrawable.clone();
InstructionScreen.extend({
    size : new vec2(1123, 842),
    /* array of instruction screens */
    screens : ["./images/gui/instructions/0.png",
        "./images/gui/instructions/1.png", "./images/gui/instructions/2.png"],
    screenObject : Model.Drawables.SpriteDrawable.clone(), /* object used to draw
                                                              the current page */
    previousButton : GUIButton.clone(),
    nextButton : GUIButton.clone(),
    closeButton : GUIButton.clone(),
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

        this.closeButton.setBasepath("./images/gui/instructions/close");
        this.closeButton.size = new vec2(430, 110);
        this.closeButton.position = new vec2(this.size.y - this.closeButton.size.y,
                                             0);
        this.closeButton.onclick = function() {
            this.parent.close();
        }
        this.addDrawable(this.closeButton);

        this.reset();
    },
    /* loads the instruction screen iamge for the given page number */
    loadScreen : function(number) {
        this.currentScreen = number;
        this.screenObject.load(this.screens[number]);
        if (number == 0) {
            this.previousButton.visible = false;
        } else if (this.previousButton.visible == false) {
            this.previousButton.visible = true;
        }

        if (number == this.screens.length-1) {
            this.nextButton.visible = false;
        } else if (this.nextButton.visible == false) {
            this.nextButton.visible = true;
        }
    },
    /* loads the first screen and makes it invisible */
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

/* the screen shown after the player wins or loses the game */
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
    preload : function() {
        preload(this.winImage);
        preload(this.loseImage);
    },
    show : function() {
        this._image.loaded = false; /* do not accidentally show wrong image before
                                       getting new one */
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

/* The GUI contains all HUD images, texts and buttons, but actually not all of the
   GUI. The side menu and various popup menus were seperated from it because of
   onclick problems */
GUI = Model.Drawables.BaseDrawable.clone();
GUI.extend({
    name : "GUI",
    active : false,
    size : new vec2(1920, 1080),
    buildingSelectButtonY : 123, /* the X value for all buildingSelectButtons */
    buildingSelectButtonX : 23, /* the Y value for the first buildingSelectButton */
    buildingSelectButtonSpace : 19, /* space between each buildingSelectButton */
    buildingSelectButtons : new Array(),

    startscreenGUIElements : new Array(), /* GUI elements to show before the game
                                             begins */
    inGameGUIElements : new Array(), /* GUI elements to show ingame */

    startButton : null,

    wavesTextBox : null,
    creditsTextBox : null,
    dykeHealthBox : null,
    fpsTextBox : null,

    menuBar : null, /* reference to the side menu */
    game : null, /* reference to the game */

    /* initializes all GUI stuff, should only be called once per game */
    init : function() {
        this.game = Game;
        this.initSplash();
        this.initHUD();
        Model.addDrawable(this);
        Model.addDrawable(FinalScreen);
    },
    /* initializes splash screen */
    initSplash : function() {
        var splashscreen = Model.Drawables.SpriteDrawable.clone()
        splashscreen.load("./images/gui/splashscreen.png");
        splashscreen.size = new vec2(1920, 1080);
        this.addGUIElement(splashscreen, false);
    },
    /* initializes HUD elements */
    initHUD : function() {
        var sideImage = Model.Drawables.SpriteDrawable.clone();
        sideImage.visible = false;
        sideImage.size = new vec2(224, 1080);
        sideImage.load("./images/gui/hud_left.png");
        this.addGUIElement(sideImage);
        var upImage = Model.Drawables.SpriteDrawable.clone();
        upImage.visible = false;
        upImage.position.x = 222;
        upImage.size = new vec2(1699, 98);
        upImage.load("./images/gui/hud_up.png");
        this.addGUIElement(upImage);

        this.initWavesText();
        this.initCreditsText();
        this.initDykeHealth();
        if (settings.showFPS) {
            this.initFPSText();
        }
        this.initButtons();
        this.initMenuBar();
    },
    initWavesText : function() {
        this.wavesTextBox = Model.Drawables.TextDrawable.clone();
		this.wavesTextBox.position = new vec2(1635, 28);
		this.wavesTextBox.size = new vec2(400, 20);
		this.wavesTextBox.font = "bold 52px US_Sans";
		this.wavesTextBox.color = "#FE0000";
        this.wavesTextBox.borderWidth = 2;
        this.wavesTextBox.borderColor = 'black';
        this.wavesTextBox.borderWidth = 2;
        this.wavesTextBox.borderColor = 'black';
		this.addGUIElement(this.wavesTextBox);
    },
    initCreditsText : function() {
        this.creditsTextBox = Model.Drawables.TextDrawable.clone();
		this.creditsTextBox.position = { x: 100,
                                         y: 55 };
		this.creditsTextBox.size = new vec2(400, 20);
		this.creditsTextBox.font = "bold 35px US_Sans";
		this.creditsTextBox.color = "#FEF500" ;
        this.creditsTextBox.borderWidth = 2;
        this.creditsTextBox.borderColor = 'black';
		this.addGUIElement(this.creditsTextBox);
    },
    initDykeHealth : function() {
        this.dykeHealthBox = Model.Drawables.TextDrawable.clone();
		this.dykeHealthBox.position = { x: 274,
                                        y: 28 };
		this.dykeHealthBox.size = new vec2(400, 20);
		this.dykeHealthBox.font = "bold 52px US_Sans";
		this.dykeHealthBox.color = "#23F407";
        this.dykeHealthBox.borderWidth = 2;
        this.dykeHealthBox.borderColor = 'black';
		this.addGUIElement(this.dykeHealthBox);
    },
    initFPSText : function() {
        this.fpsTextBox = Model.Drawables.TextDrawable.clone();
		this.fpsTextBox.position = { x: 900,
                                        y: 14 };
		this.fpsTextBox.size = new vec2(400, 20);
		this.fpsTextBox.font = "bold 52px US_Sans";
		this.fpsTextBox.color = "#FE0000";
        this.fpsTextBox.borderWidth = 2;
        this.fpsTextBox.borderColor = 'black';
		this.addGUIElement(this.fpsTextBox);
    },
    /* initializes buttons and adds building select buttons */
    initButtons : function() {
        this.startButton = StartButton;
        this.startButton.size = new vec2(250, 250);
        this.startButton.position = new vec2(
            View.canvasWidth / 2 - this.startButton.size.x / 2,
            View.canvasHeight / 2 - this.startButton.size.y * 0.7); 
        this.addGUIElement(this.startButton, false);
        this.addBuildingSelectButton(ShootingDefence, "./images/gui/icons/heimeid_stone");
        this.addBuildingSelectButton(Platform, "./images/gui/icons/platform");
        this.addBuildingSelectButton(Priest, "./images/gui/icons/priest");
        this.addBuildingSelectButton(Stone, "./images/gui/icons/stone");
        this.addBuildingSelectButton(RemoveDefence, "./images/gui/icons/remove");
    },
    /* initializes side menu, but keeps it seperate from the main GUI class */
    initMenuBar : function() {
        this.menuBar = MenuBar;
        this.menuBar.load("./images/gui/menubar.png");
        this.menuBar.position = {x: 1850, y: 540 - this.menuBar.size.y / 2};
        Model.addDrawable(this.menuBar);

        Model.addDrawable(InstructionScreen);
    },
    /* adds a button, text or image to draw during the game or before the game
       starts */
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
    /* adds a buildingselectbutton for the given building and with given
       image basepath in the correct position */
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
    /* deselects currently selected building */
    deselectBuilding : function() {
        PlayerData.selectedBuilding = null;
        for (var i = this.buildingSelectButtons.length-1; i > -1; i--) {
                this.buildingSelectButtons[i].deselect();
        }
    },
    unlockBuilding : function(buildingObject) {
        for (var i = this.buildingSelectButtons.length-1; i > -1; i--) {
                if (this.buildingSelectButtons[i].building === buildingObject) {
                    this.buildingSelectButtons[i].unlock();
                    return;
                }
        }
    },
    /* starts the game */
    gameStart : function() {
        for (var i = this.inGameGUIElements.length-1; i > -1; i--) {
            this.inGameGUIElements[i].visible = true;
        }
        this.game.gameStart();
        this.menuBar.gameStart();
        this.buildingSelectButtons[0].onmousedown();
        this.menuStop();
    },
    /* stops the game */
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
    /* starts the menu */
    menuStart : function() {
        this.size.x = 1920;
        for (i = this.startscreenGUIElements.length-1; i > -1; i--) {
            this.startscreenGUIElements[i].visible = true;
        }
    },
    /* stops the menu */
    menuStop : function() {
        this.size.x = 1920 - settings.tileSize.x * settings.tilesPerLane;
        for (i = this.startscreenGUIElements.length-1; i > -1; i--) {
            this.startscreenGUIElements[i].visible = false;
        }
    },
    /* shows the final screen */
    endGame : function() {
        FinalScreen.show();
    },
    /* updates HUD texts every frame */
    update : function() {
        this.wavesTextBox.text = "RONDE " + (EnemyController.currentWave +
            !PlayerData.areWavesFinished) +
            "/" + Waves.waves.length;
        this.creditsTextBox.text = "F " + PlayerData.credits + ",-";
        this.dykeHealthBox.text = "DIJK: " + ((this.game.dyke.health <= 0) ? 0 :
            Math.round((this.game.dyke.health / settings.dykeHealth * 100))) + "%";
        if (settings.showFPS) {
            this.fpsTextBox.text = "FPS: " + View.lastfps;
        }
    },
    newWave : function() {
        //this.wavesTextBox.color = 
    }
});

/* the side menu, which slides open from the right */
MenuBar = Model.Drawables.ButtonDrawable.clone();
MenuBar.extend({
    visible : false,
    restartButton : GUIButton.clone(),
    instructionButton : GUIButton.clone(),
    stopButton : GUIButton.clone(),
    soundButton : GUIButton.clone(),
    size : new vec2(679, 476),
    textPosition : new vec2(83, 15), /* offset where the texts will be drawn */
    textSize : new vec2(386, 72), /* size for all text images */
    originPosition : null,
    destination : null,
    slidedOut : false,
    speed : settings.menuMoveSpeed,
    cursor : "pointer",
    gui : GUI, /* reference to the GUI */
    /* initializes all buttons */
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
    /* resets stuff and makes itself visible for when the game starts */
    gameStart : function() {
        this.visible = true;
        this.soundButton.updateBasepath();
    },
    /* makes itself invisible for when the game ends */
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
