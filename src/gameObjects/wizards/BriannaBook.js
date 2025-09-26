/* global Phaser */
import WizardBook from './WizardBook.js';

export default class BriannaBook extends WizardBook {
    constructor() {
        super();
        this.surroundingTiles = [];
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                if ((dx !== 0 || dy !== 0) && Math.sqrt(dx * dx + dy * dy) <= 2) {
                    this.surroundingTiles.push({ x: dx, y: dy, dist: Math.sqrt(dx * dx + dy * dy) });
                }
            }
        }
    }

    magicAttackTiles(scene) {
        const targetTiles = [];
        const validTiles = [];

        for (let x = scene.arena.origin.x; x < scene.arena.origin.x + scene.arena.width; x++) {
            for (let y = scene.arena.origin.y; y < scene.arena.origin.y + scene.arena.height; y++) {
                validTiles.push({ x, y });
            }
        }

        const center = Phaser.Utils.Array.GetRandom(validTiles);
        targetTiles.push(center);
        targetTiles.push({ x: center.x, y: center.y - 1 });
        targetTiles.push({ x: center.x, y: center.y + 1 });
        targetTiles.push({ x: center.x - 1, y: center.y });
        targetTiles.push({ x: center.x + 1, y: center.y });
        return targetTiles;
    }
}
