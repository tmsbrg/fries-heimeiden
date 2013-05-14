// Plays and manages audio
AudioPlayer = Model.Drawables.BaseDrawable.clone();
AudioPlayer.extend({
    audioList : new Array, // list of audio elements
    paused : false, // whether the current audio is paused or not
    currentAudio : null, // index number of current audio element
    /* Loads one or more files and puts them in its audio list.
    Files are given by relative filepath */
    load : function() {
        for (var i=0; i<arguments.length; i++) {
            if (typeof arguments[i] === 'string') {
                var audio = document.createElement('audio');
                audio.setAttribute('src', arguments[i]);
                this.audioList[this.audioList.length] = audio;
            } else {
                console.log("audioPlayer Error: arguments are not all strings");
                break;
            }
        }
    },
    /* Plays audio at index number number, Loops if loop is set to true.
    If no index number is given, it works as if 0 was given. */
    play : function(number, loop) {
        if (number==null) number = 0;
        if (number >= 0 && number < this.audioList.length) {
            if (this.currentAudio != null) {
                this.stop();
            }
            this.reset();
            this.currentAudio = number;
            if (loop == true) {
                this.startLoop();
            } else if (this.audioList[number].hasAttribute('loop')) {
                this.endLoop();
            }
            this.audioList[number].play();
        } else {
            console.log("AudioPlayer Error: cannot play audio " + number + ", does not exist");
            return 1;
        }
    },
    /* Makes the current audio start from the beginning */
    restart : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].currentTime = 0;
    },
    /* Resets AudioPlayer variables, for when the current audio is stopped */
    reset : function() {
        this.paused = false;
    },
    /* Pauses the current audio */
    pause : function() {
        if (this.currentAudio == null) return;
        this.paused = true;
        this.audioList[this.currentAudio].pause();
    },
    /* Unpauses the current audio */
    unpause : function() {
        if (this.currentAudio == null) return;
        this.paused = false;
        this.audioList[this.currentAudio].play();
    },
    /* Stops the current audio and unselects it */
    stop : function() {
        if (this.currentAudio == null) return;
        this.pause();
        this.restart();
        this.currentAudio = null;
    },
    /* Mutes the current audio */
    mute : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].muted = true;
    },
    /* Unmutes the current audio */
    unmute : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].muted = false;
    },
    /* Makes the current audio into a loop */
    startLoop : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].setAttribute('loop', 'loop');
    },
    /* Removes the loop property from the current audio */
    endLoop : function() {
        if (this.currentAudio == null) return;
        this.audioList[this.currentAudio].removeAttribute('loop');
    }
});

