import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';
import BriannaBook from './BriannaBook.js';

const actions = Object.keys(ASSETS.audio.wizards.brianna);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.brianna[action].key;
});

export default class Brianna extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Brianna, Tailor of Tempests`, voicelines, 0x4FA4FF, 36);

        this.attackEmitter = scene.add.particles(0, 0, 'orb', {
            tint: [0xFFFFFF, 0x4FA4FF, 0x4FA4FF, 0x4FA4FF],
            lifespan: 400,
            speed: { min: 5, max: 35 },
            scale: { start: 1.2, end: 0},
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);

        this.attackMode = 0;

        this.book = new BriannaBook();
    }

    attack() {
        this.targetAttackTiles = this.book.waveAttackTiles(this, this.attackMode);
        this.attackMode = (this.attackMode + 1) % 3;

        this.auraPulse();

        this.targetAttackTiles.forEach(tile => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.hitTile(tile.x, tile.y, 1);
            this.attackEmitter.emitParticleAt(pixelX, pixelY, 10);
        });
    }
}
