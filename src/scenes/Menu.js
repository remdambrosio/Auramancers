export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
        this.selectedWizards = [true, true, false, false, false, false, false, false];
    }

    create() {
        const centreX = this.scale.width * 0.5;
        const centreY = this.scale.height * 0.5;
        const buttonSpacing = 100;
        const wizardNames = ['Andrew', 'Mia', '?', '?', '?', '?', '?', '?'];

        this.buttons = [];

        for (let i = 0; i < 8; i++) {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const x = centreX - buttonSpacing * 1.5 + buttonSpacing * col;
            const y = centreY - buttonSpacing * 0.5 + buttonSpacing * row;

            const isEnabled = i < wizardNames.length;

            const btn = this.add.rectangle(
                x,
                y,
                100, 100,
                isEnabled
                    ? (this.selectedWizards[i] ? 0x00ff00 : 0x555555)
                    : 0x222222
            ).setStrokeStyle(4, 0xffffff);

            if (isEnabled) {
                btn.setInteractive();
            }

            this.add.text(
                btn.x, btn.y,
                isEnabled ? wizardNames[i] : 'Locked',
                { fontFamily: 'Arial Black', fontSize: 18, color: isEnabled ? '#ffffff' : '#888888', align: 'center' }
            ).setOrigin(0.5);

            if (isEnabled) {
                btn.on('pointerdown', () => {
                    this.selectedWizards[i] = !this.selectedWizards[i];
                    btn.setFillStyle(this.selectedWizards[i] ? 0x00ff00 : 0x555555);
                    this.updateStartButtonState();
                });
            }

            this.buttons.push(btn);
        }

        this.startBtn = this.add.text(centreX, centreY + buttonSpacing + 50, 'Start Game', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            backgroundColor: '#000000', padding: { x: 16, y: 8 }
        }).setOrigin(0.5).setInteractive();

        this.startBtn.on('pointerdown', () => {
            if (this.canStartGame()) {
                this.scene.start('Game', { selectedWizards: this.selectedWizards });
            }
        });

        this.updateStartButtonState();
    }

    canStartGame() {
        return this.selectedWizards.filter(Boolean).length >= 2;
    }

    updateStartButtonState() {
        if (this.canStartGame()) {
            this.startBtn.setAlpha(1);
            this.startBtn.setInteractive();
        } else {
            this.startBtn.setAlpha(0.5);
            this.startBtn.disableInteractive();
        }
    }
}