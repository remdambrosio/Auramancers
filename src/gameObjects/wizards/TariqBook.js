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
        let lastTurn = null;

        for (let i = 0; i < length; i++) {
            let dir;
            if (i < 2) {
                dir = firstDir;
            } else {
                let possibleDirs = this.directions.filter(d => {
                    if (d.x === -prevDir.x && d.y === -prevDir.y) return false;

                    let turn = null;
                    if (prevDir) {
                        let cross = prevDir.x * d.y - prevDir.y * d.x;
                        if (cross > 0) turn = 'left';
                        else if (cross < 0) turn = 'right';
                    }

                    if (lastTurn && turn && turn === lastTurn) return false;

                    return true;
                });

                dir = Phaser.Math.RND.pick(possibleDirs);
                
                if (prevDir && dir) {
                    let cross = prevDir.x * dir.y - prevDir.y * dir.x;
                    if (cross > 0) lastTurn = 'left';
                    else if (cross < 0) lastTurn = 'right';
                    else lastTurn = null;
                }
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
