import { Constants } from "./Constants"

export class BasePopup {
    constructor(scene) {
        this.scene = scene
        this.children = []
        this.visible = false
    }

    open() {
        let delay = 0;
        if (this.scene.lastPopup !== undefined) {
            this.scene.lastPopup.close();
            delay = 500;
        }
        this.scene.time.delayedCall(delay, () => {
            this.scene.lastPopup = this;
            this.scene.game.soundManager.play(Constants.Sounds.popupopen)
            for (let i = 1; i < this.children.length; i++) {
                this.children[i].y = -this.scene.screenHeight * .5
            }
            for (let i = 1; i < this.children.length; i++) {
                this.scene.tweens.add({
                    targets: this.children[i],
                    y: this.children[i].originalTweenY,
                    ease: Phaser.Math.Easing.Back.InOut,
                    duration: 500
                })
            }
            this.show()
        })
    }

    onPopupClose(){
        this.scene.game.soundManager.play(Constants.Sounds.popupClose)
    }

    close() {
        this.scene.lastPopup = undefined
        this.children.forEach((child) => {
            child.originalTweenY = child.y
        })
        for (let i = 1; i < this.children.length; i++) {
            this.scene.tweens.add({
                targets: this.children[i],
                y: -this.scene.screenHeight * .5,
                ease: Phaser.Math.Easing.Back.InOut,
                duration: 500
            }).on("complete", () => {
                this.hide()
            })
        }
    }

    hide() {
        this.visible = false
        this.children.forEach((child) => {
            child.visible = false
        })
    }

    show() {
        this.visible = true
        this.children.forEach((child) => {
            child.visible = true
        })
    }
}