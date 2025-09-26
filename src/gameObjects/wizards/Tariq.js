import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';
import TariqBook from './TariqBook.js';

const actions = Object.keys(ASSETS.audio.wizards.tariq);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.tariq[action].key;
});

export default class Tariq extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Tariq, Wizard of the Wilds`, voicelines, 0x228B22, 8);

        this.attackEmitter = scene.add.particles(0, 0, 'slash', {
            tint: [0x603B22, 0x228B22, 0x228B22],
            lifespan: 250,
            speed: { min: 5, max: 50 },
            scale: { start: 1.5, end: 0 },
            rotate: { min: 0, max: 360 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);

        this.book = new TariqBook();
    }

    attack()
    {
        this.targetAttackTiles = this.book.snakeAttackTiles(this, 5);

        this.auraPulse();

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
