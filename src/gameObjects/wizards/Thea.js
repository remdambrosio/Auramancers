import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';
import TheaBook from './TheaBook.js';

const actions = Object.keys(ASSETS.audio.wizards.thea);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.thea[action].key;
});

export default class Thea extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Thea, Novice Ninja`, voicelines, 0x3b3b3b, 48);
    
        this.attackEmitter = scene.add.particles(0, 0, 'orb', {
            tint: 0x3b3b3b,
            lifespan: 400,
            speed: { min: 10, max: 40 },
            scale: { start: 1, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);

        this.book = new TheaBook(scene, this);
    }

    attack()
    {
        // target tiles
        this.targetAttackTiles = this.book.shadowAttackTiles(this);

        // aura indicates current health
        this.auraPulse();

        // attack tiles
        this.targetAttackTiles.forEach((tile, i) => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.scene.time.delayedCall(50 * i, () => {
                this.hitTile(tile.x, tile.y, 1);
                this.attackEmitter.emitParticleAt(pixelX, pixelY, 8);
            });
        });
    }
}
