/* sets an image to be preloaded */
preload = function(src) {
    _preloadObject.add(src);
}

/* starts preloading process */
startPreload = function() {
    _preloadObject.loadAll();
}

/* object used to preload images */
_preloadObject = Model.Drawables.SpriteDrawable.clone();
_preloadObject.extend({
    sources : [], /* sources of images to be preloaded */
    currentSource : 0, /* source currently being loaded */
    /* adds src to list of sources to preload */
    add : function(src) {
        this.sources[this.sources.length] = src;
    },
    /* called whenever a source has been loaded successfully */
    onload : function() {
        _preloadObject.nextSource(); /* not this because of
                                        old SpriteDrawable workaround */
    },
    /* goes to load the next source if available */
    nextSource : function() {
        if (this.currentSource < this.sources.length-1) {
            this.currentSource++;
            this.load(this.sources[this.currentSource]);
        }
    },
    /* starts the preloading process */
    loadAll : function() {
        this.load(this.sources[0]);
    }
});

