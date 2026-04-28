/* global Phaser */
import WizardBook from './WizardBook.js';

export default class TariqBook extends WizardBook {
    constructor() {
        super();
        this.flowerDirections = [
                                        {x:  0, y: -2},
                        {x: -1, y: -1}, {x:  0, y: -1}, {x:  1, y: -1},
        {x: -2, y:  0}, {x: -1, y:  0},                 {x:  1, y:  0}, {x:  2, y: 0},
                        {x: -1, y:  1}, {x:  0, y:  1}, {x:  1, y:  1},
                                        {x:  0, y:  2},
        ]
    }

    moveDirection(wizard) {
        // find dangerous directions
        const threats = [];
        for (const offset of this.flowerDirections) {
            const tileX = wizard.tile.x + offset.x;
            const tileY = wizard.tile.y + offset.y;
            if (wizard.isTileOccupied(tileX, tileY)) {
                threats.push({ x: offset.x, y: offset.y });
            }
        }

        // find safe directions based on threats
        const safeDirs = new Set();
        for (const threat of threats) {
            for (const dir of this.directions) {
                const dot = threat.x * dir.x + threat.y * dir.y;
                if (dot < 0) {
                    safeDirs.add(JSON.stringify(dir));
                }
            }
        }

        // try safe directions first
        const safeList = Array.from(safeDirs).map(s => JSON.parse(s));
        Phaser.Utils.Array.Shuffle(safeList);
        for (const dir of safeList) {
            if (this.validDirection(wizard, dir)) {
                return dir;
            }
        }

        // if no valid safe direction, pick a random direction
        // note: unlike other wizards, Tariq doesn't bias away from fences
        const randomList = Phaser.Utils.Array.Shuffle([...this.directions]);
        for (const dir of randomList) {
            if (this.validDirection(wizard, dir)) {
                return dir;
            }
        }
        return null;
    }

    flowerAttackTiles(wizard) {
        const targetTiles = [
                                                    {x: wizard.tile.x, y: wizard.tile.y-2},
            {x: wizard.tile.x-2, y: wizard.tile.y},                                         {x: wizard.tile.x+2, y: wizard.tile.y},
                                                    {x: wizard.tile.x, y: wizard.tile.y+2},
        ];
        return targetTiles;
    }
}
