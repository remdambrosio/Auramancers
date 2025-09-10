/* global Phaser */
import wizardClasses from '../wizardClasses.js';

export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
        this.selectedWizards = [wizardClasses[0], wizardClasses[1]];
        this.descriptionText = null;
    }

    create() {
        const centreX = this.scale.width * 0.5;
        const centreY = this.scale.height * 0.5 -50;
        const buttonSpacing = 100;
        const buttonsPerRow = 4;
        const numRows = 3;

        this.descriptionText = this.add.text(
            centreX, buttonSpacing * numRows + 75,
            '',
            {
                fontFamily: 'Arial',
                fontSize: 16,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center',
                wordWrap: { width: 500 },
            }
        ).setOrigin(0.5);

        this.buttons = [];

        for (let i = 0; i < 12; i++) {
            const row = Math.floor(i / buttonsPerRow);
            const col = i % buttonsPerRow;
            const x = centreX - buttonSpacing * (buttonsPerRow / 2 - 0.5) + buttonSpacing * col;
            const y = centreY - 50 - buttonSpacing * 0.5 + buttonSpacing * row;

            const wizardInfo = wizardClasses[i];
            const isEnabled = !!wizardInfo;
            const isSelected = isEnabled && this.selectedWizards.includes(wizardInfo);

            const btn = this.add.rectangle(
                x,
                y,
                100, 100,
                isEnabled
                    ? ( (isSelected) ? 0xFFFFFF : 0x555555 )
                    : 0x222222
            ).setStrokeStyle(4, 0x000000);

            if (isEnabled) {
                btn.setInteractive();

                btn.on('pointerdown', () => {
                    const idx = this.selectedWizards.indexOf(wizardInfo);
                    if (idx !== -1) {
                        this.selectedWizards.splice(idx, 1);
                    } else {
                        this.selectedWizards.push(wizardInfo);
                    }
                    btn.setFillStyle(this.selectedWizards.includes(wizardInfo) ? 0xFFFFFF : 0x555555);
                    this.updateStartButtonState();
                });

                btn.on('pointerover', () => {
                    if (this.descriptionText) {
                        this.descriptionText.setText(wizardInfo.description);
                    }
                });

                btn.on('pointerout', () => {
                    if (this.descriptionText) {
                        this.descriptionText.setText('');
                    }
                });
            }

            this.add.text(
                btn.x, btn.y,
                isEnabled ? wizardInfo.name : '???',
                {
                    fontFamily: 'Arial Black',
                    fontSize: 18,
                    color: isEnabled ? '#ffffff' : '#888888',
                    stroke: '#000000',
                    strokeThickness: 4,
                    align: 'center',
                }
            ).setOrigin(0.5);

            this.buttons.push(btn);
        }

        this.startBtn = this.add.text(centreX, buttonSpacing * numRows + 130, 'IGNITE AURA', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 16, y: 8 },
        }).setOrigin(0.5).setInteractive();

        this.startBtn.on('pointerdown', () => {
            if (this.canStartGame()) {
                this.scene.start('Game', { selectedWizards: this.selectedWizards });
            }
        });

        this.updateStartButtonState();
    }

    canStartGame() {
        const count = this.selectedWizards.length;
        return count >= 2 && count <= 4;
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