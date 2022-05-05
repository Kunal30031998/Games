import { Utilities } from "./Utilities"
import { SettingsPopup } from "../Popups/SettingsPopup"
import { QuitPopup } from "../Popups/QuitPopup"
import { Constants } from "./Constants"
import { MenuSettingsPopup } from "../Popups/MenuSettingsPopup"
import { GUIButton } from "./GUIButton"

export class Header {
    constructor(sceneName, scene) {
        this.scene = scene
        this.sceneName = sceneName
        if (this.sceneName === Constants.PreloaderView)
            return
        if (this.sceneName === Constants.GamePlayView || this.sceneName === Constants.GamePlayPerformOperation || this.sceneName === Constants.LevelSelectView)
            this.settingsPopup = new SettingsPopup(scene)
        else
            this.settingsPopup = new MenuSettingsPopup(scene)
        // this.settingsPopup = new SettingsPopup(scene)
        this.quitPopup = new QuitPopup(scene)
    }

    create() {
        if (this.sceneName === Constants.PreloaderView)
            return

        this.logoImg = this.scene.add.image(100, 100, 'logo').setOrigin(0.5).setDepth(1000).setScale(1.5)

        this.HomeBtn = new GUIButton(this.scene, this.scene.screenWidth - 350, 100, 'homeBtn', 1000, "", () => {
            Utilities.changeScene(this.scene, Constants.LevelSelectView)
        })

        this.QuitBtn = new GUIButton(this.scene, this.scene.screenWidth - 350, 100, 'quit', 1000, "", () => {
            if (!this.quitPopup.visible) {
                this.quitPopup.open()
            }
        })

        this.settingsBTN = new GUIButton(this.scene, 130, 0, 'settings', 1000, "", () => {
            if (!this.settingsPopup.visible) {
                this.settingsPopup.open()
                this.scene.gameplayTimer && (this.scene.gameplayTimer.paused = true)
                if(this.scene.GameOverPopup){
                    this.scene.GameOverPopup.GameOverContainer.visible = false;
                    this.scene.GameTimeOverPopup.GameOverContainer.visible = false;
                }
            }
        })
        this.settingsBTN.button.followObject = this.HomeBtn.button

        if (Utilities.getServerParam(this.scene, Constants.ServerParameters.ShowFullScreenButton)) {
            this.fullscreenBTN = new GUIButton(this.scene, 260, 0, this.scene.scale.isFullscreen ? "fullScreenClose" : "fullScreen", 1000, "", () => {
                Utilities.fullScreen(this.scene, this.fullscreenBTN.button)
            })
            this.fullscreenBTN.button.followObject = this.HomeBtn.button
        }

        this.settingsPopup.create()
        this.quitPopup.create()

        if (this.sceneName === Constants.MenuView){
            this.HomeBtn.button.setVisible(false);
            this.QuitBtn.button.setVisible(true);
        }
        else{
            this.QuitBtn.button.setVisible(false);
        }
    }
}