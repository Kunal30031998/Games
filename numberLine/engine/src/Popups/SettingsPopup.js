import { BasePopup } from "../Utilities/BasePopup"
import { GUIButton } from "../Utilities/GUIButton"
import { Utilities } from "../Utilities/Utilities"
import { HelpPopup } from "./HelpPopup"
import { Slider } from "../Utilities/Slider"
import { QuitPopup } from "./QuitPopup"

export class SettingsPopup extends BasePopup {
    constructor(scene) {
        super(scene)
        this.helpPopup = new HelpPopup(this.scene)
        this.quitPopup = new QuitPopup(scene)
    }

    create() {
        this.helpPopup.create()
        this.quitPopup.create()
        this.children.push(this.scene.add.rectangle(this.scene.screenWidth * .5, this.scene.screenHeight * .5, this.scene.screenWidth, this.scene.screenHeight, 0x000000).setDepth(100).setOrigin(0.5).setAlpha(.7).setInteractive())

        this.panel = this.scene.add.image(this.scene.screenWidth * .5, this.scene.screenHeight * .5, 'settingsPopup').setOrigin(0.5).setDepth(100).setScale(1.2)
        this.settingsHeader = this.scene.add.image(0, -310, 'settinglabel').setOrigin(0.5).setDepth(100)

        this.textSFX = this.scene.add
        .text(-410, -40, "SFX", {
            fontSize: 50 + 'px',
            fontFamily: 'Roboto-Bold',
            color: '#071500',
            align: 'left',
        })
        .setDepth(100)
        this.SFXSlider = new Slider({
            scene: this.scene,
            x: 0,
            y: 40,
            width: 800,
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
            .text(-410, -235, "Music", {
                fontSize: 50 + 'px',
                fontFamily: 'Roboto-Bold',
                color: '#071500',
                align: 'left',
            })
            .setDepth(100)
        this.MusicSlider = new Slider({
            scene: this.scene,
            x: 0,
            y: -135,
            width: 800,
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

        this.helpBTN = new GUIButton(this.scene, -220, 200, 'btn', 100, "HELP", () => {
            this.close()
            this.onPopupClose()
            this.helpPopup.open()
        })
        this.helpBTN.text.setFontSize(40)
        this.helpBTN.button.setScale(.8)

        this.quitBTN = new GUIButton(this.scene, 220, 200, 'btn', 100, "QUIT", () => {
            this.close()
            this.onPopupClose()
            if (!this.quitPopup.visible) {
                this.quitPopup.open()
            }
        })
        this.quitBTN.text.setFontSize(40)
        this.quitBTN.button.setScale(.8)

        this.closeBTN = new GUIButton(this.scene, this.panel.width * .54, -this.panel.height * .51,  'close', 100, "", () => {
            this.close()
            this.onPopupClose()
            this.scene.gameplayTimer && (this.scene.gameplayTimer.paused = false)
            this.scene.time.addEvent({ delay: 300, callback: ()=>{
                this.scene.GameOverPopup && (this.scene.GameOverPopup.GameOverContainer.visible = true);
                this.scene.GameTimeOverPopup && (this.scene.GameTimeOverPopup.GameOverContainer.visible = true);
            }, callbackScope: this.scene})
            
        })

        this.helpBTN.text.followObject = this.quitBTN.text.followObject = this.helpBTN.button.followObject = this.quitBTN.button.followObject = this.settingsHeader.followObject = this.closeBTN.button.followObject = this.panel

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
        this.children.push(this.helpBTN.button)
        this.children.push(this.quitBTN.button)
        this.children.push(this.helpBTN.text)
        this.children.push(this.quitBTN.text)

        this.close()
        this.hide()
    }
}