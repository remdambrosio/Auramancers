/* global Phaser */

export default class WizardBook {
    constructor() {
        this.directions = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 }
        ];
    }

    moveDirection(wizard) {
        const validDirs = this.validMoveDirections(wizard);
        if (validDirs.length === 0) return null;
        return Phaser.Math.RND.pick(validDirs);
    }

    validMoveDirections(wizard) {
        return this.directions.filter(dir => {
            const tileX = wizard.tile.x + dir.x;
            const tileY = wizard.tile.y + dir.y;
            const pixelX = wizard.mapOffset.x + (tileX * wizard.tileSize);
            const pixelY = wizard.mapOffset.y + (tileY * wizard.tileSize);
            return wizard.scene.getTileAt(pixelX, pixelY) === -1 && !wizard.isTileOccupied(tileX, tileY);
        });
    }

    attackDirection() {
        return Phaser.Math.RND.pick(this.directions);
    }
}
