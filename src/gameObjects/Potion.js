/* global Phaser */
import ASSETS from '../assets.js';

export default class Watcher extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, spriteKey, type)
    {
        super(scene, x, y, ASSETS.spritesheet.items.key, spriteKey, type);
    }
}
