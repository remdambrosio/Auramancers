import Andrew from './gameObjects/wizards/Andrew.js';
import Mia from './gameObjects/wizards/Mia.js';
import Tariq from './gameObjects/wizards/Tariq.js';
import Rem from './gameObjects/wizards/Rem.js';
import Chris from './gameObjects/wizards/Chris.js';
import Julian from './gameObjects/wizards/Julian.js';
import Jacob from './gameObjects/wizards/Jacob.js';

const wizardClasses = [
    {
        name: 'Andrew',
        description: "His flame grows longer for each spectator burned",
        class: Andrew
    },
    {
        name: 'Chris',
        description: "He revives dead spectators as vengeful spirits",
        class: Chris
    },
    {
        name: 'Jacob',
        description: "His elixers are brewed from the WoW subreddit's sentiment",
        class: Jacob
    },
    {
        name: 'Julian',
        description: "His curse forces him to rise and fight again",
        class: Julian
    },
    {
        name: 'Mia',
        description: "She charms spectators to do her bidding",
        class: Mia
    },
    {
        name: 'Rem',
        description: "His harmful hurricane is fueled by contributions to this game",
        class: Rem
    },
    {
        name: 'Tariq',
        description: "His thorny vines slither unpredictably",
        class: Tariq
    },
];

export default wizardClasses;