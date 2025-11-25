/* global Phaser */
import WizardBook from './WizardBook.js';
import ASSETS from '../../assets.js';

export default class TheaBook extends WizardBook {
    constructor(scene, wizard) {
        super();
        this.scene = scene;
        this.wizard = wizard;

        this.shadowSprite = scene.add.sprite(0, 0, ASSETS.spritesheet.wizards.key, 48)
            .setTint(0x3b3b3b)
            .setVisible(false);
    }

    shadowAttackTiles() {
        const targetTiles = [];
        const validTiles = [];
        const dir = this.attackDirection();

        for (let x = this.scene.arena.origin.x; x < this.scene.arena.origin.x + this.scene.arena.width; x++) {
            for (let y = this.scene.arena.origin.y; y < this.scene.arena.origin.y + this.scene.arena.height; y++) {
                const tileX = x;
                const tileY = y;
                const pixelX = this.wizard.mapOffset.x + (tileX * this.wizard.tileSize);
                const pixelY = this.wizard.mapOffset.y + (tileY * this.wizard.tileSize);
                if (this.scene.getTileAt(pixelX, pixelY) === -1 && !this.wizard.isTileOccupied(tileX, tileY)) {
                    validTiles.push({ x, y });
                }
            }
        }

        const cloneTile = Phaser.Utils.Array.GetRandom(validTiles);

        this.shadowSprite.setPosition(
            cloneTile.x * this.wizard.tileSize + this.wizard.mapOffset.x,
            cloneTile.y * this.wizard.tileSize + this.wizard.mapOffset.y
        ).setAlpha(0).setVisible(true);
        this.scene.tweens.add({
            targets: this.shadowSprite,
            alpha: 1,
            duration: 100,
            onComplete: () => {
                this.scene.time.delayedCall(300, () => {
                    this.scene.tweens.add({
                        targets: this.shadowSprite,
                        alpha: 0,
                        duration: 200,
                        onComplete: () => {
                            this.shadowSprite.setVisible(false);
                        }
                    });
                });
            }
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
