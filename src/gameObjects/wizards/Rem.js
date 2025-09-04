import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.rem);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.rem[action].key;
});

export default class Rem extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Rem, Seasick Prince`, voicelines, 0x0026FF, 12);

        this.attackMode = 0;
    }

    attack() {
        this.targetAttackTiles = [];
        const diagonals = [
            { x: -1, y: -1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: 1, y: 1 }
        ];
        const adjacents = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 }
        ];

        if (this.attackMode === 0) {
            adjacents.forEach(dir => {
                this.targetAttackTiles.push({
                    x: this.tile.x + dir.x,
                    y: this.tile.y + dir.y
                });
            });
        } else if (this.attackMode === 1) {
            diagonals.forEach(dir => {
                this.targetAttackTiles.push({
                    x: this.tile.x + dir.x,
                    y: this.tile.y + dir.y
                });
            });
        } else if (this.attackMode === 2) {
            [...diagonals, ...adjacents].forEach(dir => {
                this.targetAttackTiles.push({
                    x: this.tile.x + dir.x,
                    y: this.tile.y + dir.y
                });
            });
        }

        this.attackMode = (this.attackMode + 1) % 3;

        this.auraPulse();

        this.targetAttackTiles.forEach(tile => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.hitTile(tile.x, tile.y, 1);
            this.attackEmitter.emitParticleAt(pixelX, pixelY, 5);
        });
    }
}