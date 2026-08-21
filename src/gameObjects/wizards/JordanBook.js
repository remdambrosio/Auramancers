/* global Phaser */
import WizardBook from './WizardBook.js';

export default class JordanBook extends WizardBook {
    constructor() {
        super();
    }

    pathTiles(wizard) {
        const dir = Phaser.Math.RND.pick(this.directions);
        const path = [];
        let x = wizard.tile.x;
        let y = wizard.tile.y;
        while (true) {
            const nextX = x + dir.x;
            const nextY = y + dir.y;
            const minX = wizard.scene.arena.origin.x;
            const minY = wizard.scene.arena.origin.y;
            const maxX = minX + wizard.scene.arena.width - 1;
            const maxY = minY + wizard.scene.arena.height - 1;
            if (nextX < minX || nextX > maxX || nextY < minY || nextY > maxY) {
                break;
            }
            if (!this.validDirection(wizard, dir)) {
                break;
            }
            x = nextX;
            y = nextY;
            path.push({ x, y });
        }
        return path;
    }
}
