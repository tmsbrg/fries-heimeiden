// example game with HTML5 2DRE
var rectAn = Model.Drawables.AnimatedDrawable.clone() 
var rect = Model.Drawables.AnimationDrawable.clone();
var rect2;
var rect3;
const redgold = 0;
const purplegreen = 1;
const disint = 2;

const rectsize = 64;

rect.onhover = function() {
    this.parent.onhover();
}

// automatically called when mouse hovers over the drawableObject
rectAn.onhover = function() {
        console.log("boom!");
        rectAn.pause();
}
// randomize position
rectAn.randomPos = function() {
        this.position = { x:random(View.canvasWidth - this.size.x),
                          y:random(View.canvasHeight - this.size.y) };
}

// initializes the game
initialize = function() {
    rectAn.size = {x:rectsize, y:rectsize};
	rect.frameSize = {x:rectsize, y: rectsize};
	rect.frameN = 2;
    rect2 = rect.clone();
    rect2.load("./images/testanim.png");
    rect2.offset = {x:0, y:rectsize};
    rect3 = rect.clone();
    rect.load("./images/testanim.png");
    rect3.load("./images/testanim2.png");
    rect3.frameN = 4;
    rectAn.addAnimations(rect, rect2, rect3);
    rectAn.showAnimation(random(rectAn.animationList.length-1));
    rectAn.randomPos();
    Model.addDrawable(rectAn);
}

d = 0; t = 5;
Controller.update = function() {
    d += deltaTime;
    if (d>t){d=0;rectAn.showAnimation(random(rectAn.animationList.length-1))}
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
