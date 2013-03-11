// example game with HTML5 2DRE
var rect = Model.Drawables.AnimatedDrawable.clone();
const rectsize = 128;
const rectv = 320;
var drectx = rectv;
var drecty = rectv;

// automatically called when mouse hovers over the drawableObject
rect.onhover = function() {
        console.log("boom!");
        this.randomPos();
}
// randomize position
rect.randomPos = function() {
        this.position = { x:random(View.canvasWidth - this.size.x),
                          y:random(View.canvasHeight - this.size.y) };
}

// initializes the game
initialize = function() {
    rect.size = { x:rectsize, y:rectsize};
	rect.frameSize = {x:64, y:64};
	rect.frameN = 4;
    rect.load("./images/testanim.png");
    rect.cursor = "pointer";
    rect.randomPos();
    Model.addDrawable(rect);
}

// called every frame
Controller.update = function() {
	
    rect.position.x += drectx * deltaTime;
    rect.position.y += drecty * deltaTime;
    if (rect.position.x + rect.size.x > View.canvasWidth) {
        drectx = -rectv;
    } else if (rect.position.x < 0) {
        drectx = rectv;
    }
    if (rect.position.y + rect.size.y > View.canvasHeight) {
        drecty = -rectv;
    } else if (rect.position.y < 0) {
        drecty = rectv;
    }
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

