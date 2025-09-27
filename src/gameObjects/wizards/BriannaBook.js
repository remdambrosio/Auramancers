import WizardBook from './WizardBook.js';

export default class BriannaBook extends WizardBook {
    constructor() {
        super();
        this.diagonals = [
            { x: -1, y: -1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: 1, y: 1 }
        ];
    }

    waveAttackTiles(wizard, attackMode) {
        const targetTiles = [];

        if (attackMode === 0) {
            this.directions.forEach(dir => {
                targetTiles.push({
                    x: wizard.tile.x + dir.x,
                    y: wizard.tile.y + dir.y
                });
            });
        } else if (attackMode === 1) {
            this.diagonals.forEach(dir => {
                targetTiles.push({
                    x: wizard.tile.x + dir.x,
                    y: wizard.tile.y + dir.y
                });
            });
        } else if (attackMode === 2) {
            [...this.diagonals, ...this.directions].forEach(dir => {
                targetTiles.push({
                    x: wizard.tile.x + dir.x,
                    y: wizard.tile.y + dir.y
                });
            });
        }

        return targetTiles;
    }
}
