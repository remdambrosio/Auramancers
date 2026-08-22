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

        this.attackEmitter = scene.add.particles(0, 0, 'slash', {
            tint: [0xFFD800],
            lifespan: 300,
            speed: { min: 5, max: 50 },
            scale: { start: 1.3, end: 0 },
            rotate: { min: 0, max: 45 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);

        this.trailEmitter = scene.add.particles(0, 0, 'orb', {
            tint: 0x3b3b3b,
            lifespan: 250,
            speed: { min: 5, max: 50 },
            scale: { start: 0.8, end: 0 },
            rotate: { min: 0, max: 360 },
            alpha: 0.1,
            blendMode: 'NORMAL',
            emitting: false
        });
        this.trailEmitter.setDepth(100);
    }

    move() {
        const path = this.book.pathTiles(this);

        if (!path.length) {
            this.targetMoveTile = null;
            this.raceTrail = [];
            return;
        }

        this.raceTrail = [
            { x: this.tile.x, y: this.tile.y },
            ...path
        ];
        this.targetMoveTile = path[path.length - 1];

        const damageTrail = this.raceTrail.slice(0, -1);
        damageTrail.forEach((tile, i) => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            const delay = (200 * i) / Math.max(1, damageTrail.length);

            this.scene.time.delayedCall(delay, () => {
                this.trailEmitter.emitParticleAt(pixelX, pixelY, 10);
            });
        });

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
        this.auraPulse();
        if (!this.raceTrail || !this.raceTrail.length) return;
        const damageTrail = this.raceTrail.slice(0, -1);
        damageTrail.forEach((tile, i) => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.scene.time.delayedCall(50 * i, () => {
                this.hitTile(tile.x, tile.y, 1);
                this.attackEmitter.emitParticleAt(pixelX, pixelY, 10);
            });
        });
    }
}
