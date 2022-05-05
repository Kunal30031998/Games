import Phaser from 'phaser'
import { GamePlayView } from './Screens/GamePlayView'
import { GamePlayPerformOperation } from './Screens/GamePlayPerformOperation'
import { LevelSelectView } from './Screens/LevelSelectView'
import { MenuView } from './Screens/MenuView'
import { PreloaderView } from './Screens/PreloaderView'
import { Constants } from './Utilities/Constants'
import { Utilities } from './Utilities/Utilities'
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'

// URL Parameters = http://localhost:8080/index.html?contentPath=../Packet/&full_screen=false&home=true&result=true&timer=true&hint=true&question_header=true&audio=true&audio_play=true&bg_color=rgba(0,0,0,0)&interactive_mode=true&difficlty=M
var searchParams = new URL(window.location.href).searchParams
for (let param of searchParams) {
    localStorage.setItem(Constants.ServerStoragePrefix + param[0], Utilities.convertToPremitive(param[1]))
}

let bgColor = localStorage.getItem(Constants.ServerStoragePrefix + Constants.ServerParameters.GameBackgroundColor)
if (bgColor == null)
    bgColor = Constants.ServerParameterDefaults[Constants.ServerParameters.GameBackgroundColor]
let audio = localStorage.getItem(Constants.ServerStoragePrefix + Constants.ServerParameters.PlayAudio)
if (audio == null)
    audio = Constants.ServerParameterDefaults[Constants.ServerParameters.PlayAudio]

let game = new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: bgColor,
    scene: [PreloaderView, MenuView,LevelSelectView, GamePlayView,GamePlayPerformOperation],
    scale: {
        width: 1920,
        height: 1080,
        mode: (window.innerWidth <= window.innerHeight) ? Phaser.Scale.FIT : Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH
    },
    audio: {
        noAudio: !audio
    },
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        }]
    }
})

game.musicEnabled = true
game.soundEnabled = true
game.musicVolume = .2
game.soundVolume = .2
let musicVolume = localStorage.getItem("musicVolume")
if (musicVolume != null)
    game.musicVolume = musicVolume
let soundVolume = localStorage.getItem("soundVolume")
if (soundVolume != null)
    game.soundVolume = soundVolume