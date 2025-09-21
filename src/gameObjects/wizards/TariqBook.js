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
        let firstDir = Phaser.Math.RND.pick(this.directions);

        for (let i = 0; i < length; i++) {
            let dir;
            if (i < 2) {
                dir = firstDir;
            } else {
                let possibleDirs = this.directions.filter(d => !(d.x === -prevDir.x && d.y === -prevDir.y));
                dir = Phaser.Math.RND.pick(possibleDirs);
            }
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
