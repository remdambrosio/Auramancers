import Andrew from './gameObjects/wizards/Andrew.js';
import Mia from './gameObjects/wizards/Mia.js';
import Tariq from './gameObjects/wizards/Tariq.js';
import Rem from './gameObjects/wizards/Rem.js';
import Chris from './gameObjects/wizards/Chris.js';

const wizardClasses = [
    {
        name: 'Andrew',
        description: 'Fire grows longer with each spectator burned',
        class: Andrew
    },
    {
        name: 'Mia',
        description: 'Entrances spectators with otherworldly charm',
        class: Mia
    },
    {
        name: 'Tariq',
        description: 'Thorny branches reach out in a T',
        class: Tariq
    },
    {
        name: 'Rem',
        description: 'Stands in the eye of a harmful hurricane',
        class: Rem
    },
    {
        name: 'Chris',
        description: 'Revives dead spectators as vengeful spirits',
        class: Chris
    }
];

export default wizardClasses;