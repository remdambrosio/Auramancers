import WizardBook from './WizardBook.js';

async function loadMentions() {
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
        this.mentions = loadMentions();
    }
}
