// example game with HTML5 2DRE
var rectAn = Model.Drawables.AnimatedDrawable.clone() 
var rect = Model.Drawables.AnimationDrawable.clone();
var rect2;
var rect3;
var txt;

const rectsize = {x:873,y:486};

rectAn.onclick = function() {
    this.showAnimation(random(this.animationList.length-1));
}

// randomize position
rectAn.randomPos = function() {
        this.position = {x:0,y:0};
}

// initializes the game
initialize = function() {
    rectAn.size = rectsize;
	rect.frameSize = rectsize;
    rect.secondsPerFrame = 0.15;
	rect.frameN = 4;
    rect2 = rect.clone();
    rect2.load("./images/spritesheet.png");
    rect2.offset = {x:0, y:rectsize.y};
    rect3 = rect.clone();
    rect.load("./images/spritesheet.png");
    rect3.load("./images/spritesheet.png");
    rect3.offset = {x:0, y:rectsize.y*2};
    rectAn.addAnimations(rect, rect2, rect3);
    rectAn.showAnimation(0);
    rectAn.onclick = function() {
        this.showAnimation(random(this.animationList.length-1));
        console.log(txt);
    }
    rectAn.onAnimationComplete = function(index) {
        console.log("completed animation: " + index);
        this.showAnimation(random(this.animationList.length-1));
        console.log("playing animation: " + this.currentAnimationIndex);
    }
    rectAn.randomPos();
    Model.addDrawable(rectAn);
    txt = Model.getLocalTextFile("./text.txt");
}

d = 0; t = 4;
Controller.update = function() {
    //d += deltaTime;
    //if (d>t){d=0;rectAn.showAnimation(random(rectAn.animationList.length-1))}
}

// no arguments given: returns random float between 0 and 1
// only max given: returns random int between 0 and max
// min and max given: returns random int between min and max
random = function(max, min) {
    if (max == null) {
        return Math.random();
    } else if (min == null) {
        min = 0;
    }
    return Math.round(Math.random() * (max - min) + min);
}
