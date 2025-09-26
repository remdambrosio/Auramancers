/* global Phaser */
import WizardBook from './WizardBook.js';

export default class AvalonBook extends WizardBook {
    constructor() {
        super();
    }

    tentacleAttackTiles(wizard) {
        let targetTiles = [];
        let curTile = { ...wizard.tile };
        let dir = Phaser.Math.RND.pick(this.directions);

        const perpendiculars = [
            { x: -dir.y, y: dir.x },
            { x: dir.y, y: -dir.x }
        ];
        const branchIndex = Phaser.Math.RND.pick([null, 1, 2]);
        const branchSide = Phaser.Math.RND.pick([0, 1]);

        for (let i = 0; i < 4; i++) {
            curTile = {
                x: curTile.x + dir.x,
                y: curTile.y + dir.y
            };
            targetTiles.push({ ...curTile });

            if (branchIndex !== null && i === branchIndex) {
                const perp = perpendiculars[branchSide];
                targetTiles.push({
                    x: curTile.x + perp.x,
                    y: curTile.y + perp.y
                });
            }
        }

        return targetTiles;
    }
}
