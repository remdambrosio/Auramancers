import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.tariq);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.tariq[action].key;
});

export default class Tariq extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Tariq, Friend of Trees`, voicelines, 0x228B22, 8);

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

        // target end tiles
        const finalTile = this.targetAttackTiles[this.targetAttackTiles.length - 1];
        let perpDirs;
        if (dir.x === 0) {
            perpDirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }];
        } else {
            perpDirs = [{ x: 0, y: 1 }, { x: 0, y: -1 }];
        }
        perpDirs.forEach(dir => {
            this.targetAttackTiles.push({
                x: finalTile.x + dir.x,
                y: finalTile.y + dir.y
            });
        });

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
