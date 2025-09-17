import WizardBook from './wizardBook.js';

async function loadContributions() {
    const response = await fetch('../../../data/contributions.json');
    return await response.json();
}

export default class RemBook extends WizardBook {
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
        this.normalizedCommits = [];
        this.currentWeekIndex = 0;

        loadContributions().then(contributions => {
            const commits = contributions.map(c => c.commits);
            const min = Math.min(...commits);
            const max = Math.max(...commits);
            this.normalizedCommits = commits.map(c => {
                if (max !== min) {
                    return Math.round(4 + ((c - min) / (max - min)) * (this.surroundingTiles.length - 4));
                }
                return 4;
            });
        });
    }

    contributionAttack(wizard) {
        const attackCount = this.normalizedCommits[this.currentWeekIndex] || 1;
        const tiles = [];

        // group tiles by distance
        const groups = {};
        for (const tile of this.surroundingTiles) {
            const key = tile.dist.toFixed(2);
            if (!groups[key]) groups[key] = [];
            groups[key].push(tile);
        }

        // sort tiles by distance, ascending
        const sortedKeys = Object.keys(groups).sort((a, b) => parseFloat(a) - parseFloat(b));

        // shuffle within each group
        const prioritizedTiles = [];
        for (const key of sortedKeys) {
            this.shuffle(groups[key]);
            prioritizedTiles.push(...groups[key]);
        }

        for (let i = 0; i < attackCount; i++) {
            const dir = prioritizedTiles[i % prioritizedTiles.length];
            tiles.push({
                x: wizard.tile.x + dir.x,
                y: wizard.tile.y + dir.y
            });
        }

        this.currentWeekIndex = (this.currentWeekIndex + 1) % this.normalizedCommits.length;

        return tiles;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
