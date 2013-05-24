// example game with HTML5 2DRE
var rectAn = Model.Drawables.AnimatedDrawable.clone() 
var rect = Model.Drawables.AnimationDrawable.clone();

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
    rect.size = rectsize;
	rect.frameN = 4;
    rect.load("./images/test4p.png");
    rectAn.addAnimations(rect);
    rectAn.showAnimation(0);
    rectAn.onAnimationComplete = function() {
        this.pause();
    },
    Model.addDrawable(rectAn);
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
