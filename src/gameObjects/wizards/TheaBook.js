/* global Phaser */
import WizardBook from './WizardBook.js';
import ASSETS from '../../assets.js';

export default class TheaBook extends WizardBook {
    constructor() {
        super();
    }

    shadowAttackTiles(wizard) {
        const targetTiles = [];
        const validTiles = [];
        const dir = this.attackDirection();

        for (let x = wizard.scene.arena.origin.x; x < wizard.scene.arena.origin.x + wizard.scene.arena.width; x++) {
            for (let y = wizard.scene.arena.origin.y; y < wizard.scene.arena.origin.y + wizard.scene.arena.height; y++) {
                const tileX = wizard.tile.x;
                const tileY = wizard.tile.y;
                const pixelX = wizard.mapOffset.x + (tileX * wizard.tileSize);
                const pixelY = wizard.mapOffset.y + (tileY * wizard.tileSize);
                if (wizard.scene.getTileAt(pixelX, pixelY) === -1 && !wizard.isTileOccupied(tileX, tileY)) {
                    validTiles.push({ x, y });
                }
            }
        }

        const cloneTile = Phaser.Utils.Array.GetRandom(validTiles);

        const shadowSprite = wizard.scene.add.sprite(
            cloneTile.x * wizard.tileSize + wizard.mapOffset.x,
            cloneTile.y * wizard.tileSize + wizard.mapOffset.y,
            ASSETS.spritesheet.wizards.key,
            48
        ).setTint(0x3b3b3b);
        wizard.scene.time.delayedCall(500, () => {
            shadowSprite.destroy();
        });

        if (dir.x !== 0) {
            targetTiles.push({ x: cloneTile.x, y: cloneTile.y - 1 });
            targetTiles.push({ x: cloneTile.x, y: cloneTile.y + 1 });
        } else if (dir.y !== 0) {
            targetTiles.push({ x: cloneTile.x - 1, y: cloneTile.y });
            targetTiles.push({ x: cloneTile.x + 1, y: cloneTile.y });
        }

        return targetTiles;
    }
}
