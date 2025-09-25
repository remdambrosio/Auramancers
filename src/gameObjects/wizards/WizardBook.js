/* global Phaser */

export default class WizardBook {
    constructor() {
        this.directions = [
            { x: -1, y: 0 }, // left
            { x: 1, y: 0 },  // right
            { x: 0, y: -1 }, // up
            { x: 0, y: 1 }   // down
        ];
    }

    validDirection(wizard, dir) {
        const tileX = wizard.tile.x + dir.x;
        const tileY = wizard.tile.y + dir.y;
        const pixelX = wizard.mapOffset.x + (tileX * wizard.tileSize);
        const pixelY = wizard.mapOffset.y + (tileY * wizard.tileSize);
        return wizard.scene.getTileAt(pixelX, pixelY) === -1 && !wizard.isTileOccupied(tileX, tileY);
    }

    moveDirection(wizard) {
        // try random direction
        const randomIndex = Phaser.Math.RND.between(0, 3);
        const dir = this.directions[randomIndex];
        if (this.validDirection(wizard, dir)) {
            return dir;
        }

        // check opposite direction first (makes moving away from walls more likely)
        const oppositeDir = this.directions[randomIndex ^ 1];
        if (this.validDirection(wizard, oppositeDir)) {
            return oppositeDir;
        }

        // check remaining directions
        for (let i = 0; i < 4; i++) {
            if (i !== randomIndex && i !== (randomIndex ^ 1)) {
                if (this.validDirection(wizard, this.directions[i])) {
                    return this.directions[i];
                }
            }
        }

        // can't move
        return null;
    }

    attackDirection() {
        return Phaser.Math.RND.pick(this.directions);
    }
}
