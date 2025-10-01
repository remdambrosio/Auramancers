/* global Phaser */
import WizardBook from './WizardBook.js';

export default class TheaBook extends WizardBook {
    constructor() {
        super();
    }

    shadowAttackTiles(scene) {
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
