import WizardBook from './WizardBook.js';

async function loadContributions() {
    let base = '/';
    if (window.location.hostname === 'remdambrosio.github.io') {
        base = '/Auramancers/';
    }
    const response = await fetch(`${base}data/contributions.json`);
    return await response.json();
}

export default class MaxBook extends WizardBook {
    constructor() {
        super();
        this.coneTiles = 7
        this.normalizedCommits = [];
        this.currentWeekIndex = 0;

        loadContributions().then(contributions => {
            const commits = contributions;
            const min = Math.min(...commits);
            const max = Math.max(...commits);
            this.normalizedCommits = commits.map(c => {
                if (max !== min) {
                    return Math.max(1, Math.round(4 + ((max - c) / (max - min)) * (this.coneTiles - 4)));
                }
                return 4;
            });
        });
    }

    reverseContributionAttackTiles(wizard) {
        const attackCount = this.normalizedCommits[this.currentWeekIndex] || 4;
        const tiles = [];
        const dir = this.attackDirection();

        const conePattern = [
            { depth: 1, spread: 0 },
            { depth: 2, spread: 1 },
            { depth: 3, spread: 1 },
        ];

        let count = 0;
        for (let row = 0; row < conePattern.length && count < attackCount; row++) {
            const { depth, spread } = conePattern[row];
            for (let s = -spread; s <= spread && count < attackCount; s++) {
                const perp = { x: -dir.y, y: dir.x };
                const offset = {
                    x: dir.x * depth + perp.x * s,
                    y: dir.y * depth + perp.y * s
                };
                tiles.push({
                    x: wizard.tile.x + offset.x,
                    y: wizard.tile.y + offset.y
                });
                count++;
            }
        }

        this.currentWeekIndex = (this.currentWeekIndex + 1) % this.normalizedCommits.length;

        return tiles;
    }
}
