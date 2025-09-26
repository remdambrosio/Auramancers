import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';
import MiaBook from './MiaBook.js';

const actions = Object.keys(ASSETS.audio.wizards.mia);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.mia[action].key;
});

export default class Mia extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Mia, Friend of Fae`, voicelines, 0x8300FF, 4);

        this.attackEmitter = scene.add.particles(0, 0, 'spark', {
            tint: [0xFFC73A, 0x8300FF, 0x8300FF],
            lifespan: 250,
            speed: { min: 5, max: 50 },
            scale: { start: 1.5, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);

        this.book = new MiaBook();
    }

    move() {
        super.move();
        // prepare for next Watcher attack, keeping them in sync
        this.book.incrementIndex();
    }

    attack()
    {
        // target tiles
        const dir = this.book.attackDirection(this);
        this.targetAttackTiles = [];
        let curTile = this.tile;
        for (let i = 0; i < 3; i++) {
            curTile = {
                x: curTile.x + dir.x,
                y: curTile.y + dir.y
            };
            this.targetAttackTiles.push({ ...curTile });
        }

        // aura indicates current health
        this.auraPulse();

        // attack tiles
        this.targetAttackTiles.forEach((tile, i) => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.scene.time.delayedCall(50 * i, () => {
                this.hitTile(tile.x, tile.y, 1);
                this.attackEmitter.emitParticleAt(pixelX, pixelY, 5);
            });
        });
    }

    hitTile(tileX, tileY, damage)
    {
        let wizardHit = this.wasWizardHit(tileX, tileY);
        if (wizardHit) {
            wizardHit.takeDamage(damage, this.energyTint);
        }
        let watcherHit = this.wasWatcherHit(tileX, tileY);
        if (watcherHit && watcherHit.lifeState === 'alive') {
            this.scene.sound.play(ASSETS.audio.watcher.charm.key, { volume: 0.8 });
            watcherHit.charm(this, this.book, this.energyTint);
        }
    }
}
