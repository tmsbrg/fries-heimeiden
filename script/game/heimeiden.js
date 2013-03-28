Game = Model.Drawables.BaseDrawabale.clone();
Game.extend({
    PlayerData : {},
    Lanes : new Array(5),
    initialize : function() {
        console.log("Starting Heimeiden...");
    }
});

initialize = function() {
    Game.initialize();
}

vec2 = function (givenx, giveny) {
    return {x:givenx,y:giveny};
}
