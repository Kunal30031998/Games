import { BasePopup } from "../Utilities/BasePopup"
import { GUIButton } from "../Utilities/GUIButton"
import { Slider } from "../Utilities/Slider"
import { Constants } from "../Utilities/Constants"
import { QuitPopup } from "./QuitPopup"

export class MenuSettingsPopup extends BasePopup {
    constructor(scene) {
        super(scene)
        this.scene = scene
    }

    create() {
        this.children.push(this.scene.add.rectangle(this.scene.screenWidth * .5, this.scene.screenHeight * .5, this.scene.screenWidth, this.scene.screenHeight, 0x000000).setDepth(100).setOrigin(0.5).setAlpha(.7).setInteractive())

        this.panel = this.scene.add.image(this.scene.screenWidth * .5, this.scene.screenHeight * .5, 'settingsPopup').setOrigin(0.5).setDepth(100)
        this.settingsHeader = this.scene.add.image(0, -250, 'settinglabel').setOrigin(0.5).setDepth(100)

        this.textSFX = this.scene.add
        .text(-340, 0, "SFX", {
            fontSize: 50 + 'px',
            fontFamily: 'Roboto-Bold',
            color: '#071500',
            align: 'left',
        })
        .setDepth(300)
        this.SFXSlider = new Slider({
            scene: this.scene,
            x: 0,
            y: 100,
            width: 650,
            height: 20,
            depth: 100,
            value: this.scene.game.soundVolume,
            min: 0,
            max: 1,
            trackColor: 0x00B151,
            bgColor: 0x0C7349,
            followObject: this.panel,
            onChange: function (value) { 
                this.scene.game.soundManager.setSoundVolume(value) 
                // this.scene.game.soundManager.play(Constants.Sounds.Scroller)
            }
        })
        this.textMusic = this.scene.add
            .text(-340, -165, "Music", {
                fontSize: 50 + 'px',
                fontFamily: 'Roboto-Bold',
                color: '#071500',
                align: 'left',
            })
            .setDepth(300)
        this.MusicSlider = new Slider({
            scene: this.scene,
            x: 0,
            y: -65,
            width: 650,
            height: 20,
            depth: 100,
            value: this.scene.game.musicVolume,
            min: 0,
            max: 1,
            trackColor: 0x00B151,
            bgColor: 0x0C7349,
            followObject: this.panel,
            onChange: function (value) { 
                this.scene.game.soundManager.setMusicVolume(value) 
                // this.scene.game.soundManager.play(Constants.Sounds.Scroller)
            }
        })
        this.closeBTN = new GUIButton(this.scene, this.panel.width * .45, -this.panel.height * .4, 'close', 100, "", () => {
            this.close()
            this.onPopupClose()
        })

        this.settingsHeader.followObject = this.closeBTN.button.followObject = this.panel

        this.textSFX.followObject = this.panel
        this.textMusic.followObject = this.panel

        this.children.push(this.panel)
        this.children.push(this.textSFX)
        this.children.push(this.textMusic)
        this.children.push(this.SFXSlider.track)
        this.children.push(this.SFXSlider.indicator)
        this.children.push(this.SFXSlider.thumb)
        this.children.push(this.MusicSlider.track)
        this.children.push(this.MusicSlider.indicator)
        this.children.push(this.MusicSlider.thumb)
        this.children.push(this.settingsHeader)
        this.children.push(this.closeBTN.button)
        this.children.push(this.MusicSlider.trackBg)
        this.children.push(this.SFXSlider.trackBg)

        this.hide()
        this.close()
    }
}