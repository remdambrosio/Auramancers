import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';
import MaxBook from './MaxBook.js';

const actions = Object.keys(ASSETS.audio.wizards.max);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.max[action].key;
});

export default class Max extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Max, Thunder Thaumaturge`, voicelines, 0x0026FF, 44);

        this.attackEmitter = scene.add.particles(0, 0, 'slash', {
            tint: [0xFFD800, 0x0026FF, 0x0026FF, 0x0026FF],
            lifespan: 400,
            speed: { min: 5, max: 35 },
            scale: { start: 1.2, end: 0 },
            rotate: { min: 0, max: 45 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);

        this.book = new MaxBook();
    }

    attack() {
        this.targetAttackTiles = this.book.reverseContributionAttackTiles(this);

        this.auraPulse();

        this.targetAttackTiles.forEach(tile => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.hitTile(tile.x, tile.y, 1);
            this.attackEmitter.emitParticleAt(pixelX, pixelY, 5);
        });
    }
}
