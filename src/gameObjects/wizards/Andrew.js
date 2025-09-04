import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.andrew);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.andrew[action].key;
});

export default class Andrew extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Andrew, Flame's Rage`, voicelines, 0xFF0000, 0);

        this.rage = 3;
    }

    attack()
    {
        // target tiles
        const chosenDir = Phaser.Math.RND.pick(this.directions);
        this.targetAttackTiles = [];
        let curTile = this.tile;
        for (let i = 0; i < this.rage; i++) {
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

    hitTile(tileX, tileY, damage) {
        let wizardHit = this.wasWizardHit(tileX, tileY);
        if (wizardHit) {
            wizardHit.takeDamage(damage, this.energyTint);
        }
        let watcherHit = this.wasWatcherHit(tileX, tileY);
        if (watcherHit && watcherHit.lifeState !== 'dead') {
            this.scene.sound.play(ASSETS.audio.watcher.hit.key, { volume: 0.4 });
            watcherHit.die(this.energyTint);
            this.rage += 1;
        }
    }
}
