export default class HealthBar extends Phaser.GameObjects.Graphics {

    constructor (scene, x, y, wizard)
    {
        super(scene);

        this.wizard = wizard;
        this.maxHealth = wizard.health;
        this.curHealth = this.maxHealth;

        this.setPosition(x, y);
        this.barWidth = 120;
        this.barHeight = 16;
        this.barBorder = 2;
        this.percent = this.barWidth / this.maxHealth;

        this.draw();
        scene.add.existing(this);
    }

    update ()
    {
        if (this.curHealth !== this.wizard.health) {
            this.curHealth = this.wizard.health;
            this.draw();
        }
    }

    draw ()
    {
        this.clear();
        // border
        this.fillStyle(0x000000);
        this.fillRect(0, 0, this.barWidth, this.barHeight);
        // background
        this.fillStyle(0xffffff);
        this.fillRect(
            this.barBorder,
            this.barBorder,
            this.barWidth - this.barBorder * 2,
            this.barHeight - this.barBorder * 2
        );
        // current health
        let curWidth = Math.floor((this.curHealth / this.maxHealth) * (this.barWidth - this.barBorder * 2));
        this.fillStyle(this.wizard.energyTint);
        this.fillRect(
            this.barBorder,
            this.barBorder,
            curWidth,
            this.barHeight - this.barBorder * 2
        );
    }
}
