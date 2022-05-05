import { Constants } from "../Utilities/Constants"

export class Dropdown {
    constructor(scene, config) {
        this.scene = scene
        this.config = config
        this.options = []
        this.current = 0
        this.opened = false

        this.followObject = scene.add.image(config.x, config.y, "multiplierImg").setOrigin(0.5).setScale(1)
        this.followObject.visible = false

        if (config.options.length > 1) {
            this.dropDownImg = scene.add.image(-255, 430, "expandcollapsebg").setDepth(config.depth + 1).setOrigin(0.5).setScale(1).setInteractive({ useHandCursor: true }).on('pointerup', () => {
                if (this.opened) {
                    this.close()
                } else {
                    this.open()
                }
                this.scene.game.soundManager.play(Constants.Sounds.popupopen)
            })
            this.dropDownArrow = scene.add.image(0, -10, "expand").setDepth(config.depth + 1).setOrigin(0.5);
            this.dropDownArrowCollapse = scene.add.image(0, -10, "collapse").setDepth(config.depth + 1).setOrigin(0.5).setVisible(false);
            // this.dropDownImg.rotation = 4.7;s
            this.dropDownImg.followObject = this.followObject
            this.dropDownArrow.followObject = this.dropDownImg
            this.dropDownArrowCollapse.followObject = this.dropDownImg
        }

        // let temp = scene.add.image(0, 0, "dropdownBg").setOrigin(0.5).setScale(1)
        // scene.rexUI.add.roundRectangle(config.x, config.y + ((temp.height * .8) * (config.options.length - 1) - (temp.height * .8) / 2), temp.width * .8, temp.height * .8 * config.options.length, 40, 0x444444).setDepth(config.depth - 1)
        // temp.destroy()

        config.options.forEach((option, index) => {
            let image = scene.add.image(-500, 310, "multiplierImg").setOrigin(0.5).setScale(1).setDepth(config.depth - index)
                .setInteractive({ useHandCursor: true }).on('pointerup', () => {
                    if (index == this.current) {
                        if (this.opened) {
                            this.close()
                        } else {
                            this.open()
                        }
                    } else {
                        this.current = index
                        this.close()
                        config.onChange(option)
                    }
                })
            let text = scene.add.text(0, 310, option, {
                fontSize: '40px',
                fontFamily: 'Roboto-Bold',
                color: '#ffffff',
                wordWrap: { width: image.width * .5 }
            }).setOrigin(0.5).setDepth(config.depth - index)
            this.height = image.height

            image.followObject = this.followObject
            text.followObject = this.followObject

            if (index !== this.current) {
                image.visible = false
                text.visible = false
            }

            this.options.push({
                option: option,
                image: image,
                text: text
            })
        })
        // config.onChange(this.options[this.current].option)
    }

    open() {
        // this.scene.game.soundManager.play(Constants.Sounds.Popup)
        this.options.forEach((option, index) => {
            this.scene.tweens.add({
                targets: [option.image, option.text],
                y: this.followObject.y - ((index* 1.07 * this.height) - 300) * this.scene.scaleY,
                yOriginal: (this.followObject.yOriginal - ((index* 1.07 * this.height) + 105)),
                ease: Phaser.Math.Easing.Back.InOut,
                duration: 500
            })
            option.image.visible = true
            option.text.visible = true
        })
        this.opened = true
        this.dropDownArrowCollapse.setVisible(true)
        this.dropDownArrow.setVisible(false)
    }

    close() {
        // this.scene.game.soundManager.play(Constants.Sounds.PopupClose)
        this.options.forEach((option, index) => {
            if (index == this.current) {
                option.image.setDepth(this.config.depth + 1)
                option.text.setDepth(this.config.depth + 1)
            } else {
                option.image.setDepth(this.config.depth)
                option.text.setDepth(this.config.depth)
            }
            this.scene.tweens.add({
                targets: [option.image, option.text],
                y: this.followObject.y +300*this.scene.scaleY,
                yOriginal: 300,
                ease: Phaser.Math.Easing.Back.InOut,
                duration: 500
            }).on("complete", () => {
                if (index !== this.current) {
                    option.image.visible = false
                    option.text.visible = false
                }
            })
        })
        this.opened = false
        this.dropDownArrowCollapse.setVisible(false)
        this.dropDownArrow.setVisible(true)
    }

    get() {
        return this.options[this.current]
    }

    hide(){
        this.options.forEach((option) => {
            option.image.visible = false;
            option.text.visible = false;
        })
        this.dropDownArrow.visible = false;
        this.dropDownImg.visible = false;
    }

    show(){
        this.options.forEach((option) => {
            option.image.visible = true;
            option.text.visible = true;
        })
        this.dropDownArrow.visible = true;
        this.dropDownImg.visible = true;
    }
}