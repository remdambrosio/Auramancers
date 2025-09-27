import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';
import AvalonBook from './AvalonBook.js';

const actions = Object.keys(ASSETS.audio.wizards.avalon);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.avalon[action].key;
});

export default class Avalon extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Avalon, Wretched Witchlock`, voicelines, 0x00A864, 32);
    
        this.attackEmitter = scene.add.particles(0, 0, 'tentacle', {
            tint: this.energyTint,
            lifespan: 600,
            blendMode: 'NORMAL',
            emitting: false,
            scaleY: { start: 1.6, end: 0, ease: 'expo.inOut' },
            scaleX: {
                onEmit: function () { 
                    return ( 0.5 > Math.random() ) ? -1.6 : 1.6;
                }
            },
        });
        this.attackEmitter.setDepth(200);

        this.book = new AvalonBook();
    }

    // attack()
    // {
    //     this.targetAttackTiles = this.book.tentacleAttackTiles(this);

    //     this.auraPulse();

    //     this.targetAttackTiles.forEach((tile, i) => {
    //         const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
    //         const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
    //         this.scene.time.delayedCall(25 * i, () => {
    //             this.hitTile(tile.x, tile.y, 1);
    //             this.attackEmitter.emitParticleAt(pixelX, pixelY, 1);
    //         });
    //     });
    // }

    attack()
    {
        // target tiles
        const dir = this.book.attackDirection(this);
        this.targetAttackTiles = [];
        let curTile = this.tile;
        for (let i = 0; i < 5; i++) {
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
                this.attackEmitter.emitParticleAt(pixelX, pixelY, 1);
            });
        });
    }
}
