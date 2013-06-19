/* constants for actor movement directions */
const LEFT = -1;
const RIGHT = 1;
const NONE = 0;

/* collision tags */
const collisionDefault = 0;
const collisionEnemy = 1;
const collisionDefence = 2;
const collisionPlatform = 3;
const collisionBullet = 4;
const collisionShell = 5;
const collisionStone = 6;

/* used for final count down when it is not active */
const INACTIVE = -1000;

/* calculated from settings */
const FIELD_SIZE = settings.tileSize.x * settings.tilesPerLane;

/* set max FPS, done here so that we know settings have loaded and View has not
been initialized yet */
View.fps = settings.maxFPS;

/* nullify wait before wave if there are no instructions to show */
if (!settings.showInstructions) {
    settings.defaultWaitBeforeWave = 0;
}
