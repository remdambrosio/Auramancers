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
        let branchOrigins = [1, 2];
        let numBranches = Phaser.Math.RND.pick([1, 2]);
        let branchIndices = Phaser.Utils.Array.Shuffle(branchOrigins).slice(0, numBranches).sort();
        let branchSides;
        if (numBranches === 2) {
            branchSides = Phaser.Math.RND.pick([
                [0, 1],
                [1, 0]
            ]);
        } else {
            branchSides = [Phaser.Math.RND.pick([0, 1])];
        }

        for (let i = 0; i < 4; i++) {
            curTile = {
                x: curTile.x + dir.x,
                y: curTile.y + dir.y
            };
            targetTiles.push({ ...curTile });

            branchIndices.forEach((branchIndex, idx) => {
                if (i === branchIndex) {
                    const perp = perpendiculars[branchSides[idx]];
                    targetTiles.push({
                        x: curTile.x + perp.x,
                        y: curTile.y + perp.y
                    });
                }
            });
        }

        return targetTiles;
    }
}
