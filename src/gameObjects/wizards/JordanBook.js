/* global Phaser */
import WizardBook from './WizardBook.js';

export default class JordanBook extends WizardBook {
    constructor() {
        super();
    }

    pathTiles(wizard) {
        const dirIndex = Phaser.Math.RND.between(0, 3);
        let dir = this.directions[dirIndex];
        const path = [];
        let x = wizard.tile.x;
        let y = wizard.tile.y;
        let lastOpenIndex = -1;

        const minX = wizard.scene.arena.origin.x;
        const minY = wizard.scene.arena.origin.y;
        const maxX = minX + wizard.scene.arena.width - 1;
        const maxY = minY + wizard.scene.arena.height - 1;

        const isInsideArena = (tileX, tileY) =>
            tileX >= minX &&
            tileX <= maxX &&
            tileY >= minY &&
            tileY <= maxY;

        const isOpenTile = (tileX, tileY) => {
            if (!isInsideArena(tileX, tileY)) return false;

            const pixelX = wizard.mapOffset.x + (tileX * wizard.tileSize);
            const pixelY = wizard.mapOffset.y + (tileY * wizard.tileSize);

            return wizard.scene.getTileAt(pixelX, pixelY) === -1;
        };

        const firstX = x + dir.x;
        const firstY = y + dir.y;

        if (!isOpenTile(firstX, firstY)) {
            dir = this.directions[dirIndex ^ 1];

            const fallbackX = x + dir.x;
            const fallbackY = y + dir.y;

            if (
                isOpenTile(fallbackX, fallbackY) &&
                !wizard.isTileOccupied(fallbackX, fallbackY)
            ) {
                return [{ x: fallbackX, y: fallbackY }];
            }

            return [];
        }

        while (true) {
            const nextX = x + dir.x;
            const nextY = y + dir.y;

            if (!isOpenTile(nextX, nextY)) {
                break;
            }

            x = nextX;
            y = nextY;
            path.push({ x, y });

            if (!wizard.isTileOccupied(x, y)) {
                lastOpenIndex = path.length - 1;
            }
        }

        return lastOpenIndex === -1
            ? []
            : path.slice(0, lastOpenIndex + 1);
    }
}
