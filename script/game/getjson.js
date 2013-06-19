/* object to contain already loaded and parsed json files */
jsons = {};

/* loads json file if it hasn't been loaded before, or returns a preloaded object */
getJSON = function(filepath) {
    var editedpath = filepath.replaceAll(".", "").replaceAll("/", "_");
    if (jsons[editedpath]) {
        return jsons[editedpath];
    }
    return jsons[editedpath] = loadJSON(filepath);
}

/* loads json file and returns it parsed as an object */
loadJSON = function(filepath) {
    return JSON.parse(Model.getLocalTextFile(filepath));
}

