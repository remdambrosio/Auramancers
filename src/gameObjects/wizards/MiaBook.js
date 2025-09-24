import WizardBook from './WizardBook.js';

async function loadPopularities() {
    let base = '/';
    if (window.location.hostname === 'remdambrosio.github.io') {
        base = '/Auramancers/';
    }
    const response = await fetch(`${base}data/fae.json`);
    return await response.json();
}

export default class MiaBook extends WizardBook {
    constructor() {
        super();

        this.currentPopularityIndex = 0;

        loadPopularities().then(popularities => {
            const min = Math.min(...popularities);
            const max = Math.max(...popularities);
            // normalize 2-6
            this.normalizedPopularities = popularities.map(val => {
                if (max === min) return 4;
                return Math.round(2 + ((val - min) * (6 - 2)) / (max - min));
            });
        });
    }

    incrementIndex() {
        this.currentPopularityIndex = (this.currentPopularityIndex + 1) % (this.normalizedPopularities?.length ?? 1);
    }

    getPopularity() {
        return this.normalizedPopularities[this.currentPopularityIndex];
    }
}
