import { Constants } from "../Utilities/Constants"
import { BaseScene } from "../Utilities/BaseScene"
import { Utilities } from "../Utilities/Utilities"
import { SoundManager } from "../Utilities/SoundManager"
import { Confetti } from "../Utilities/Confetti"

export class PreloaderView extends BaseScene {
    constructor() {
        super({
            key: Constants.PreloaderView,
            pack: {
                files: [{
                    type: 'image',
                    key: 'menuBG',
                    url: '../packet/assets/MenuView/title_bg.png'
                },
                {
                    type: 'image',
                    key: 'bgelelement',
                    url: '../packet/assets/MenuView/bgelelement.png'
                },
                {
                    type: 'image',
                    key: 'titlebg',
                    url: '../packet/assets/MenuView/titlebg.png'
                },
                {
                    type: 'image',
                    key: 'mask',
                    url: '../packet/assets/MenuView/mask.png'
                },
                {
                    type: 'image',
                    key: 'Gamelogo',
                    url: '../packet/assets/MenuView/game_logo.png'
                },
                {
                    type: 'image',
                    key: 'preloader_base',
                    url: '../packet/assets/PreloaderScreen/preloader.png'
                },
                {
                    type: 'image',
                    key: 'preloader_filler',
                    url: '../packet/assets/PreloaderScreen/preloader-filler.png'
                },
                {
                    type: 'atlas',
                    key: 'preloaderAnim',
                    textureURL: '../packet/assets/PreloaderScreen/loader.png',
                    atlasURL: '../packet/assets/PreloaderScreen/loader.json'
                },
                {
                    type: 'json',
                    key: 'jsonData',
                    url: '../packet/data.json'
                },
                {
                    type: 'json',
                    key: 'loadingText',
                    url: '../packet/loadingText.json'
                }]
            }
        })
    }

    init() {
        super.create()
        Utilities.createAnim(this, 'preloaderAnim', 'loading', this.screenWidth / 2, this.screenHeight * .54)
        this.loadingTextJson = this.cache.json.get('loadingText');
        this.add.image(this.screenWidth * .5, this.screenHeight * .7, 'preloader_base').setOrigin(0.5)
        this.preloaderFiller = this.add.image(this.screenWidth * .5, this.screenHeight * .7, 'preloader_filler').setOrigin(0.5)
        var loadingTextStyle = { "fill": "#000000", "font": "normal 25px Roboto " };
        this.loadingText = this.add.text(this.screenWidth * .5, this.screenHeight * .75, '', loadingTextStyle).setOrigin(0.5);
        this.changeLoadingText();
    }

    preload() {
        this.game.soundManager = new SoundManager(this)
        this.game.confetti = new Confetti(this)

        this.load.image("helpPanel", "../packet/assets/Help_popup.png")
        this.load.image("helpoutline", "../packet/assets/helpoutline.png")
        this.load.image("toastBG", "../packet/assets/toastBG.png")

        this.load.image("logo", "../packet/assets/Header/logo.png")
        this.load.image("fullScreen", "../packet/assets/Header/fullscreenBtn.png")
        this.load.image("fullScreenClose", "../packet/assets/Header/fullscreenBtnClose.png")
        this.load.image("settings", "../packet/assets/Header/settingBtn.png")
        this.load.image("power", "../packet/assets/Header/quit_btn.png")
        this.load.image("close", "../packet/assets/Header/close_btn.png")
        this.load.image("yesBTN", "../packet/assets/Header/yes_btn.png")
        this.load.image("noBTN", "../packet/assets/Header/no_btn.png")
        this.load.image("homeBtn", "../packet/assets/Header/homeBtn.png")

        this.load.image("bg", "../packet/assets/GamePlayView/Background.png")
        this.load.image("Scakebg", "../packet/assets/GamePlayView/Scakebg.png")
        this.load.image("grids", "../packet/assets/GamePlayView/grids.png")
        this.load.image("guides", "../packet/assets/GamePlayView/guide.png")
        this.load.image("player", this.jsonData.common.player)
        this.load.image("Buttons", "../packet/assets/GamePlayView/joypad.png")
        this.load.image("panel", "../packet/assets/GamePlayView/settingsPanel.png")
        this.load.image("gameCompletePanel", "../packet/assets/GamePlayView/complete_popup.png")
        this.load.image("gameOverPanel", "../packet/assets/GamePlayView/Game_over.png")
        this.load.image("hintBTN", "../packet/assets/GamePlayView/hint.png")
        this.load.image("skipBTN", "../packet/assets/GamePlayView/skip.png")
        this.load.image("guideBTNon", "../packet/assets/GamePlayView/guide_btn.png")
        this.load.image("guideBTNoff", "../packet/assets/GamePlayView/guide_btn_close.png")
        this.load.image("scorePanel", "../packet/assets/GamePlayView/score_box.png")
        this.load.image("questionPanel", "../packet/assets/GamePlayView/question_bar.png")
        this.load.image("CollectionArea", "../packet/assets/GamePlayView/Collect_area.png")
        this.load.image("HelpButton", "../packet/assets/GamePlayView/help_btn.png")
        this.load.image("settingsQuitButton", "../packet/assets/GamePlayView/setting_quit_btn.png")
        this.load.image("SFXon", "../packet/assets/GamePlayView/sfxbtn0001.png")
        this.load.image("SFXoff", "../packet/assets/GamePlayView/sfxbtn0002.png")
        this.load.image("MusicOn", "../packet/assets/GamePlayView/music_btn0001.png")
        this.load.image("MusicOff", "../packet/assets/GamePlayView/music_btn0002.png")
        this.load.image("hintPanel", "../packet/assets/GamePlayView/hint_popup.png")
        this.load.image("TimerBase", "../packet/assets/GamePlayView/timer_bace.png")
        this.load.image("TimerFill", "../packet/assets/GamePlayView/timer_bar.png")
        this.load.image("replyBTN", "../packet/assets/GamePlayView/replay_btn.png")
        this.load.image("nextBTN", "../packet/assets/GamePlayView/next_btn.png")
        this.load.image("timerClock", "../packet/assets/GamePlayView/timer_clock.png")
        this.load.image("quitGameComplete", "../packet/assets/GamePlayView/quit_btn_game_comp.png")
        this.load.image("blankStars", "../packet/assets/GamePlayView/blank_stars.png")
        this.load.image("star1", "../packet/assets/GamePlayView/star1.png")
        this.load.image("star3", "../packet/assets/GamePlayView/star2.png")
        this.load.image("star2", "../packet/assets/GamePlayView/star3.png")
        this.load.image("Line", "../packet/assets/GamePlayView/Line.png")
        this.load.image("zoomin", "../packet/assets/GamePlayView/zoomin.png")
        this.load.image("zoomout", "../packet/assets/GamePlayView/zoomout.png")
        this.load.image("button", "../packet/assets/GamePlayView/button.png")
        this.load.image("VerticleLine", "../packet/assets/GamePlayView/VerticleLine.png")
        this.load.image("Next", "../packet/assets/GamePlayView/Next.png")
        this.load.image("previous", "../packet/assets/GamePlayView/previous.png")
        this.load.image("btn", "../packet/assets/GamePlayView/btn.png")
        this.load.image("selectedbtn", "../packet/assets/GamePlayView/selectedbtn.png")
        this.load.image("LevelSelect", "../packet/assets/GamePlayView/LevelSelect.png")
        this.load.image("NumberOperationBg", "../packet/assets/GamePlayView/NumberOperationBg.png")
        this.load.image("point_timerbg", "../packet/assets/GamePlayView/point&timerbg.png")
        this.load.image("bgelelement", "../packet/assets/GamePlayView/bgelelement.png")
        this.load.image("bgelelement1", "../packet/assets/GamePlayView/bgelelement1.png")
        this.load.image("questionbtn", "../packet/assets/GamePlayView/questionbtn.png")
        this.load.image("OperationsBg", "../packet/assets/GamePlayView/OperationsBg.png")
        this.load.image("dotted_line", "../packet/assets/GamePlayView/dotted_line.png")
        this.load.image("SelectedNum", "../packet/assets/GamePlayView/SelectedNum.png")
        this.load.image("CorrectSelected", "../packet/assets/GamePlayView/CorrectSelected.png")
        this.load.image("IncorrectSelected", "../packet/assets/GamePlayView/IncorrectSelected.png")
        this.load.image("QuestionsCompletePopup", "../packet/assets/GamePlayView/QuestionsCompletePopup.png")
        this.load.image("pointbg", "../packet/assets/GamePlayView/pointbg.png")
        this.load.image("questionbg", "../packet/assets/GamePlayView/questionbg.png")
        this.load.image("pointAndtimerbg", "../packet/assets/GamePlayView/pointAndtimerbg.png")
        this.load.image("TimerLineSeprator", "../packet/assets/GamePlayView/TimerLineSeprator.png")
        this.load.image("dropdown", "../packet/assets/GamePlayView/dropdown.png")
        this.load.image("convert_btn", "../packet/assets/GamePlayView/convert_btn.png")
        this.load.image("dropdownArrow", "../packet/assets/GamePlayView/dropdownArrow.png")
        this.load.image("scaleGroup", "../packet/assets/GamePlayView/scaleGroup.png")
        this.load.image("settingsPopup", "../packet/assets/GamePlayView/settingsPopup.png")
        this.load.image("settinglabel", "../packet/assets/GamePlayView/settinglabel.png")
        this.load.image("sliderThumb", "../packet/assets/GamePlayView/sliderThumb.png")
        this.load.image("helplabel", "../packet/assets/GamePlayView/helplabel.png")
        this.load.image("quitlable", "../packet/assets/GamePlayView/quitlable.png")
        this.load.image("quitPanel", "../packet/assets/GamePlayView/quitPanel.png")
        this.load.image("blankCenterStar", "../packet/assets/GamePlayView/blankCenterStar.png")
        this.load.image("blankLeftStar", "../packet/assets/GamePlayView/blankLeftStar.png")
        this.load.image("blankRightStar", "../packet/assets/GamePlayView/blankRightStar.png")
        this.load.image("filledCenterStar", "../packet/assets/GamePlayView/filledCenterStar.png")
        this.load.image("filledLeftStar", "../packet/assets/GamePlayView/filledLeftStar.png")
        this.load.image("filledRightStar", "../packet/assets/GamePlayView/filledRightStar.png")
        this.load.image("homebtn", "../packet/assets/GamePlayView/homebtn.png")
        this.load.image("rays", "../packet/assets/GamePlayView/rays.png")
        this.load.image("blurbg", "../packet/assets/GamePlayView/blurbg.png")
        this.load.image("quit", "../packet/assets/GamePlayView/quit.png")
        this.load.image("reload", "../packet/assets/GamePlayView/reload.png")

        this.load.image("Multiply_active", "../packet/assets/GamePlayView/Multiply_active.png")
        this.load.image("Multiply", "../packet/assets/GamePlayView/Multiply.png")
        this.load.image("Minus_active", "../packet/assets/GamePlayView/Minus_active.png")
        this.load.image("Minus", "../packet/assets/GamePlayView/Minus.png")
        this.load.image("Divide", "../packet/assets/GamePlayView/Divide.png")
        this.load.image("Divide_active", "../packet/assets/GamePlayView/Divide_active.png")
        this.load.image("Plus", "../packet/assets/GamePlayView/Plus.png")
        this.load.image("Plus_active", "../packet/assets/GamePlayView/Plus_active.png")
        this.load.image("popup", "../packet/assets/GamePlayView/popup.png")
        this.load.image("HorizontalLine", "../packet/assets/GamePlayView/HorizontalLine.png")
        this.load.image("btnShine", "../packet/assets/GamePlayView/btnShine.png");
        this.load.image("element1", "../packet/assets/GamePlayView/element1.png");
        this.load.image("element2", "../packet/assets/GamePlayView/element2.png");
        this.load.image("element3", "../packet/assets/GamePlayView/element3.png");
        this.load.image("10xBg", "../packet/assets/GamePlayView/10xBg.png");
        this.load.image("1000X", "../packet/assets/GamePlayView/1000X.png");
        this.load.image("100X", "../packet/assets/GamePlayView/100X.png");
        this.load.image("10X", "../packet/assets/GamePlayView/10X.png");
        this.load.image("multiplierImg", "../packet/assets/GamePlayView/multiplierImg.png");
        this.load.image("particleStar", "../packet/assets/GamePlayView/particleStar.png");
        this.load.image("expandcollapsebg", "../packet/assets/GamePlayView/expandcollapsebg.png");
        this.load.image("expand", "../packet/assets/GamePlayView/expand.png");
        this.load.image("collapse", "../packet/assets/GamePlayView/collapse.png");
        this.load.image("helpoutline", "../packet/assets/GamePlayView/helpoutline.png");
        this.load.image("helpprevious", "../packet/assets/GamePlayView/helpprevious.png");
        this.load.image("helpnext", "../packet/assets/GamePlayView/helpnext.png");

        this.load.image("Gamelogo", "../packet/assets/MenuView/game_logo.png")
        this.load.image("menuBG", "../packet/assets/MenuView/title_bg.png")
        this.load.image("playBTN", "../packet/assets/MenuView/play_btn.png")
        this.load.image("helpplayBTN", "../packet/assets/MenuView/play_btn_helpsc.png")
        this.load.image("helpBTN", "../packet/assets/MenuView/help_btn.png")
        this.load.image("menuSettingsPanel", "../packet/assets/MenuView/setting_menu.png")

        this.load.image("levelUnlocked", "../packet/assets/LevelSelectView/level_unlock.png")
        this.load.image("arrow", "../packet/assets/LevelSelectView/arrow.png")

        //// For Debug Delay
        // for (let i = 0; i < 1000; i++) {
        //     this.load.image(i + "menuSettingsPanel", "../packet/assets/MenuView/setting_menu.png")
        //     this.load.image(i + "levelUnlocked", "../packet/assets/LevelSelectView/level_unlock.png")
        //     this.load.image(i + "arrow", "../packet/assets/LevelSelectView/arrow.png")
        // }

        this.loadAssets()

        // Bind the load progress and load complete callbacks
        this.load.on('progress', (progress) => {
            this.preloaderFiller.setCrop(0, 0, this.preloaderFiller.width * progress, this.preloaderFiller.height)
        })
        this.load.on('complete', () => {
            this.loadingTextTimer.destroy();
            Utilities.changeScene(this, Constants.MenuView)
        })
    }

    changeLoadingText() {
        let LoadingText = this.loadingTextJson.loadingText;
        this.loadingText.text = LoadingText[Phaser.Math.Between(0, this.loadingTextJson.loadingText.length - 1)];
        this.loadingTextTimer = this.time.delayedCall(5000, () => {
            this.changeLoadingText()
        })
    }

    // Required : Empty create is required to prevent call to parent Create function
    create() {
        this.game.soundManager.loadSounds()
    }

    loadAssets() {
        this.jsonData.common.Assets.images.forEach((asset) => {
            this.load.image(asset.asset, asset.url)
        })
        this.jsonData.common.Instructions.forEach((instruction) => {
            this.load.image(instruction.id, instruction.url)
            this.load.audio(instruction.id, instruction.audio)
        })
    }
}