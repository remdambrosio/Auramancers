import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.chris);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.chris[action].key;
});

export default class Chris extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Chris, Deathly Developer`, voicelines, 0x32D398, 16);

        this.attackEmitter = scene.add.particles(0, 0, 'flame', {
            tint: [0x8C8C83, 0x32D398, 0x32D398, 0x32D398],
            lifespan: 250,
            speed: { min: 5, max: 50 },
            scale: { start: 1.5, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);
    }

    attack()
    {
        // target tiles
        const chosenDir = Phaser.Math.RND.pick(this.directions);
        this.targetAttackTiles = [];
        let curTile = this.tile;
        for (let i = 0; i < 4; i++) {
            curTile = {
                x: curTile.x + chosenDir.x,
                y: curTile.y + chosenDir.y
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
        if (watcherHit) {
            if (watcherHit.lifeState === 'dead') {
                this.scene.sound.play(ASSETS.audio.watcher.charm.key, { volume: 0.8 });
                watcherHit.ghostify(this, this.energyTint);
            } else {
                watcherHit.die(this.energyTint);
            }
        }
    }
}
