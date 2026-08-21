import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';
import JordanBook from './JordanBook.js';

const actions = Object.keys(ASSETS.audio.wizards.jordan);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.jordan[action].key;
});

export default class Jordan extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Jordan, Racecar Ritualist`, voicelines, 0xFFD800, 52);
        this.book = new JordanBook();
        this.raceTrail;
    }

    move() {
        const path = this.book.pathTiles(this);

        if (!path.length) {
            this.targetMoveTile = null;
            this.raceTrail = [];
            return;
        }

        this.raceTrail = path;
        this.targetMoveTile = path[path.length - 1];

        this.scene.tweens.add({
            targets: this,
            x: this.mapOffset.x + (this.targetMoveTile.x * this.tileSize),
            y: this.mapOffset.y + (this.targetMoveTile.y * this.tileSize),
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                this.tile.x = this.targetMoveTile.x;
                this.tile.y = this.targetMoveTile.y;
            }
        });
    }

    attack() {
        if (!this.raceTrail || !this.raceTrail.length) return;

        this.auraPulse();

        this.raceTrail.forEach((tile, i) => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);

            this.scene.time.delayedCall(50 * i, () => {
                this.hitTile(tile.x, tile.y, 1);
                this.attackEmitter.emitParticleAt(pixelX, pixelY, 10);
            });
        });
    }
}
