import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';
import RemBook from './RemBook.js';

const actions = Object.keys(ASSETS.audio.wizards.rem);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.rem[action].key;
});

export default class Rem extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Rem, Auracrafting Admiral`, voicelines, 0x0026FF, 12);

        this.attackEmitter = scene.add.particles(0, 0, 'orb', {
            tint: [0xFFFFFF, 0x0026FF, 0x0026FF, 0x0026FF],
            lifespan: 400,
            speed: { min: 5, max: 35 },
            scale: { start: 1.2, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);

        this.book = new RemBook();
    }

    attack() {
        this.targetAttackTiles = this.book.contributionAttackTiles(this);

        this.auraPulse();

        this.targetAttackTiles.forEach(tile => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.hitTile(tile.x, tile.y, 1);
            this.attackEmitter.emitParticleAt(pixelX, pixelY, 10);
        });

        console.log(this.scene.wizardGroup.getChildren())
    }
}