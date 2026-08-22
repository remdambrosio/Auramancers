import Andrew from './gameObjects/wizards/Andrew.js';
import Mia from './gameObjects/wizards/Mia.js';
import Tariq from './gameObjects/wizards/Tariq.js';
import Rem from './gameObjects/wizards/Rem.js';
import Chris from './gameObjects/wizards/Chris.js';
import Julian from './gameObjects/wizards/Julian.js';
import Jacob from './gameObjects/wizards/Jacob.js';
import Avalon from './gameObjects/wizards/Avalon.js';
import Brianna from './gameObjects/wizards/Brianna.js';
import Gene from './gameObjects/wizards/Gene.js';
import Max from './gameObjects/wizards/Max.js';
import Thea from './gameObjects/wizards/Thea.js';
import Jordan from './gameObjects/wizards/Jordan.js';

const wizardClasses = [
    {
        name: 'Andrew',
        description: "His raging flame grows longer with each spectator it burns",
        spriteKey: 0,
        class: Andrew
    },
    {
        name: 'Avalon',
        description: "Her dark patron's tentacles slither chaotically across the arena",
        spriteKey: 32,
        class: Avalon
    },
    {
        name: 'Brianna',
        description: "Her mighty mer-tail whips up a whirlpool, striking surrounding foes",
        spriteKey: 36,
        class: Brianna
    },
    {
        name: 'Chris',
        description: "His necro-magic revives fallen fans as vengeful spirits",
        spriteKey: 16,
        class: Chris
    },
    {
        name: 'Gene',
        description: "His illusory clone supports him in battle, in life, and in love",
        spriteKey: 40,
        class: Gene
    },
    {
        name: 'Jacob',
        description: "He brews toxic poisons or healing cures, based on sentiment analysis of WoW reddit posts",
        spriteKey: 28,
        class: Jacob
    },
    {
        name: 'Jordan',
        description: "He zooms across the arena, leaving behind a shocking trail",
        spriteKey: 52,
        class: Jordan
    },
    {
        name: 'Julian',
        description: "His undead curse forces him to rise from the dead and fight again",
        spriteKey: 20,
        class: Julian
    },
    {
        name: 'Max',
        description: "His lightning blasts grow more powerful when Rem doesn't update this game's code",
        spriteKey: 44,
        class: Max
    },
    {
        name: 'Mia',
        description: "Her charmed fans attack alongside her, with power based on search trends for the word 'fae'",
        spriteKey: 4,
        class: Mia
    },
    {
        name: 'Rem',
        description: "His volcanic blasts grow stronger when this game's code on GitHub is updated often",
        spriteKey: 12,
        class: Rem
    },
    {
        name: 'Tariq',
        description: "His vines alert him to nearby enemies, allowing him to retreat and strike from afar",
        spriteKey: 8,
        class: Tariq
    },
    {
        name: 'Thea',
        description: "Her shadow clone technique allows her to attack distant locations without warning",
        spriteKey: 48,
        class: Thea
    }
];

export default wizardClasses;
