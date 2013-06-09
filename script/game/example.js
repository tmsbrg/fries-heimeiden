// example game with HTML5 2DRE

View.fps = 40; // set max FPS

const rectsize = 30; // the speed for our rectangle
const rectspeed = 180; // the speed we will move our rectangle with in pixels per second

// the evil rect must be clicked on!
var rect = Model.Drawables.RectangleDrawable.clone();
rect.extend({
    size : {x: rectsize, y: rectsize}, // size of rectangle
    cursor : "pointer", // sets cursor to be a pointer when hovering over rect

    speed : {x: rectspeed, y: rectspeed},
    colors : ['red', 'green', 'blue', 'yellow', 'purple', 'pink', 'black'],

    // automatically called when object is added to the game
    onDrawInit : function() {
        this.randomDirection();
        this.randomColor();
        this.randomPosition();
    },
    // called every frame
    update : function() {
        this.position.x += this.speed.x * deltaTime;
        this.position.y += this.speed.y * deltaTime;
        if (rect.position.x + rect.size.x > View.canvasWidth) {
            this.speed.x = -rectspeed;
        } else if (rect.position.x < 0) {
            this.speed.x = rectspeed;
        }
        if (rect.position.y + rect.size.y > View.canvasHeight) {
            this.speed.y = -rectspeed;
        } else if (rect.position.y < 0) {
            this.speed.y = rectspeed;
        }
    },
    // automatically called when mouse button goes down over the drawableObject
    onmousedown : function() {
            console.log("boom!");
            this.randomDirection();
            this.randomColor();
            this.randomPosition();
    },
    // randomize direction
    randomDirection : function() {
        this.speed.x = random(1) ? this.speed.x : -this.speed.x;
        this.speed.y = random(1) ? this.speed.y : -this.speed.y;
    },
    // randomize color
    randomColor : function() {
        this.color = this.colors[random(this.colors.length-1)];
    },
    // randomize position
    randomPosition : function() {
        this.position = { x:random(View.canvasWidth - this.size.x),
                          y:random(View.canvasHeight - this.size.y) };
    }
});

// a text box that shows the FPS
var fpsTextBox = Model.Drawables.TextDrawable.clone();
fpsTextBox.extend({
    position : { x: 5, y: 10 },
    size : { x: 100, y: 20},
    ignoremouse : true, // don't absorb mouse events
    font : "bold 14px Arial",
    color : "#FE0000",
    update : function() {
        this.text = "FPS: " + View.lastfps;
    }
});

// initializes the game
initialize = function() {
    Model.addDrawable(rect); // adds the rect object to the game
    Model.addDrawable(fpsTextBox); // adds the fpsTextBox object to the game

    console.log(Model.getLocalTextFile("text.txt"));
}

// called every frame
Controller.update = function() {
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

