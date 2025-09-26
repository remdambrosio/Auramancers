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
        super(scene, x, y, `Brianna, Person of Things`, voicelines, 0xC6009F, 36);

        this.attackEmitter = scene.add.particles(0, 0, 'spark', {
            tint: [0xFFFFFF, 0xC6009F, 0xC6009F, 0xC6009F],
            lifespan: 400,
            speed: { min: 5, max: 35 },
            scale: { start: 1, end: 0, ease: 'expo.in' },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);

        this.book = new BriannaBook();
    }

    attack() {
        this.targetAttackTiles = this.book.magicAttackTiles(this.scene);
        const targetCenterTile = this.targetAttackTiles[0];
        const targetX = this.mapOffset.x + (targetCenterTile.x * this.tileSize);
        const targetY = this.mapOffset.y + (targetCenterTile.y * this.tileSize);

        this.auraPulse();

        // draw line from Brianna to target
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(4, this.energyTint, 1);
        graphics.beginPath();
        graphics.moveTo(this.x, this.y);
        graphics.lineTo(targetX, targetY);
        graphics.strokePath();
        this.scene.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 400,
            onComplete: () => graphics.destroy()
        });

        this.targetAttackTiles.forEach(tile => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.hitTile(tile.x, tile.y, 1);
            this.attackEmitter.emitParticleAt(pixelX, pixelY, 5);
        });
    }
}
