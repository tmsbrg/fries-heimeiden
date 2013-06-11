/* object oriented 2D vector implementation */

vec2 = function (arg1, arg2) {
    var x, y;
    if (typeof arg1 == "object" && arg1 instanceof vec2) {
        x = arg1.x;
        y = arg1.y;
    } else {
        if (arg1 == null) arg1 = 0;
        if (arg2 == null) arg2 = 0;
        x = arg1;
        y = arg2;
    }
    this.x = x;
    this.y = y;
}

// returns the values of the vec2 as a human-readable string
vec2.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")";
}

// adds the numbers of the vec2 object with other vec2 objects or with numbers and returns it
vec2.prototype.add = function() {
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        switch (typeof arguments[i]) {
            case "number":
                this.x += arguments[i];
                this.y += arguments[i];
                break;
            case "object":
                if (arguments[i] instanceof vec2) {
                    this.x += arguments[i].x;
                    this.y += arguments[i].y;
                    break;
                }
            default:
                console.log("vec2 error: cannot add '" + arguments[i] + "', is not a number or other vec2 object");
        }
    }
    return this;
}

// substracts other vec2 objects or scalars from the vec2 object and returns it
vec2.prototype.substract = function() {
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        switch (typeof arguments[i]) {
            case "number":
                this.x -= arguments[i];
                this.y -= arguments[i];
                break;
            case "object":
                if (arguments[i] instanceof vec2) {
                    this.x -= arguments[i].x;
                    this.y -= arguments[i].y;
                    break;
                }
            default:
                console.log("vec2 error: cannot substract '" + arguments[i] + "', is not a number or other vec2 object");
        }
    }
    return this;
}

// multiplies the vec2 object with scalar values and returns it
vec2.prototype.multiply = function() {
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        switch (typeof arguments[i]) {
            case "number":
                this.x *= arguments[i];
                this.y *= arguments[i];
                break;
            default:
                console.log("vec2 error: cannot multiply with '" + arguments[i] + "', is not a number");
        }
    }
    return this;
}

// divides the vec2 object with scalar values and returns it
vec2.prototype.divide = function() {
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        switch (typeof arguments[i]) {
            case "number":
                this.x /= arguments[i];
                this.y /= arguments[i];
                break;
            default:
                console.log("vec2 error: cannot divide by '" + arguments[i] + "', is not a number");
        }
    }
    return this;
}
