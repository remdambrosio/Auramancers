import Andrew from './gameObjects/wizards/Andrew.js';
import Mia from './gameObjects/wizards/Mia.js';
import Tariq from './gameObjects/wizards/Tariq.js';
import Rem from './gameObjects/wizards/Rem.js';
import Chris from './gameObjects/wizards/Chris.js';

const wizardClasses = [
    {
        name: 'Andrew',
        description: 'His flame grows longer for each spectator burned',
        class: Andrew
    },
    {
        name: 'Chris',
        description: 'He revives dead spectators as vengeful spirits',
        class: Chris
    },
    {
        name: 'Mia',
        description: 'She charms spectators to do her bidding',
        class: Mia
    },
    {
        name: 'Rem',
        description: 'He stands in the eye of a harmful hurricane',
        class: Rem
    },
    {
        name: 'Tariq',
        description: 'His thorny branches reach out in a T',
        class: Tariq
    },
];

export default wizardClasses;