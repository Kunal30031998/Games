import { Constants } from "./Constants"

export class Toast {
    constructor(scene) {
        this.scene = scene
    }

    create() {
        this.container = this.scene.add.container(this.scene.screenWidth * .5, this.scene.screenHeight * 1.25).setDepth(1000)
        this.panel = this.scene.add.image(0, 0, 'toastBG').setOrigin(0.5).setDepth(1000)
        this.text = this.scene.add.text(0, 0, "",
            {
                fontSize: '40px',
                fontFamily: 'Roboto-Bold',
                color: '#FFFFFF',
                align: 'center',
                lineSpacing: 10,
                wordWrap: { width: this.panel.width * .8 }
            }).setOrigin(0.5)
        this.container.add([this.panel, this.text])
    }

    showToast(toast) {
        this.scene.overlay.visible = true
        this.scene.overlay.setAlpha(0.7)
        this.scene.game.soundManager.play(Constants.Sounds.Popup)
        this.text.text = toast.text
        this.container.yOriginal = this.container.y
        this.scene.tweens.add({
            targets: this.container,
            y: this.scene.screenHeight * .75 * this.scene.scaleY,
            yOriginal: (this.scene.screenHeight * .75),
            ease: Phaser.Math.Easing.Back.InOut,
            duration: 500
        }).on("complete", () => {
            this.scene.time.delayedCall(toast.time * 1000, () => {
                this.scene.overlay.visible = false
                this.scene.overlay.setAlpha(0)
                this.scene.tweens.add({
                    targets: this.container,
                    y: this.scene.screenHeight * 1.25 * this.scene.scaleY,
                    yOriginal: (this.scene.screenHeight * 1.25),
                    ease: Phaser.Math.Easing.Back.InOut,
                    duration: 500
                }).on("complete", () => {
                })
            })
        })
    }
}