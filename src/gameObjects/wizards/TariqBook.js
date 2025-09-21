/* global Phaser */
import WizardBook from './WizardBook.js';

export default class TariqBook extends WizardBook {
    constructor() {
        super();
    }

    snakeAttackTiles(wizard, length) {
        let tiles = [];
        let curTile = { ...wizard.tile };
        let prevDir = null;

        for (let i = 0; i < length; i++) {
            let possibleDirs = this.directions;
            if (prevDir) {
                possibleDirs = this.directions.filter(dir => !(dir.x === -prevDir.x && dir.y === -prevDir.y));
            }
            const dir = Phaser.Math.RND.pick(possibleDirs);
            curTile = {
                x: curTile.x + dir.x,
                y: curTile.y + dir.y
            };
            tiles.push({ ...curTile });
            prevDir = dir;
        }
        return tiles;
    }
}
