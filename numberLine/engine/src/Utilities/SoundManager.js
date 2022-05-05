import { Constants } from "./Constants"

export class SoundManager {
    constructor(scene) {
        this.scene = scene
        this.scene.load.audio(Constants.Musics.backMusic, "../packet/assets/audios/Bgm_1.mp3")
        this.scene.load.audio(Constants.Sounds.Click, "../packet/assets/audios/click.mp3")
        this.scene.load.audio(Constants.Sounds.correctAnswer, "../packet/assets/audios/correct.mp3")
        this.scene.load.audio(Constants.Sounds.GameOver, "../packet/assets/audios/gameOver.mp3")
        this.scene.load.audio(Constants.Sounds.LevelClear, "../packet/assets/audios/levelClear.mp3")
        this.scene.load.audio(Constants.Sounds.LevelStart, "../packet/assets/audios/levelStart.mp3")
        this.scene.load.audio(Constants.Sounds.popupopen, "../packet/assets/audios/popupopen.mp3")
        this.scene.load.audio(Constants.Sounds.popupClose, "../packet/assets/audios/popupClose.mp3")
        this.scene.load.audio(Constants.Sounds.wrongAnswer, "../packet/assets/audios/Wrong.mp3")
        this.scene.load.audio(Constants.Sounds.StarCollect, "../packet/assets/audios/StarCollect.mp3")
        this.scene.load.audio(Constants.Sounds.winGame, "../packet/assets/audios/winGame.mp3")
        this.scene.load.audio(Constants.Sounds.ExpandScale, "../packet/assets/audios/ExpandScale.mp3")
    }

    loadSounds() {
        this.sounds = {}
        this.sounds[Constants.Sounds.StarCollect] = this.scene.sound.add(Constants.Sounds.StarCollect)
        this.sounds[Constants.Sounds.popupopen] = this.scene.sound.add(Constants.Sounds.popupopen)
        this.sounds[Constants.Sounds.popupClose] = this.scene.sound.add(Constants.Sounds.popupClose)
        this.sounds[Constants.Sounds.Click] = this.scene.sound.add(Constants.Sounds.Click)
        this.sounds[Constants.Sounds.GameOver] = this.scene.sound.add(Constants.Sounds.GameOver)
        this.sounds[Constants.Sounds.LevelClear] = this.scene.sound.add(Constants.Sounds.LevelClear)
        this.sounds[Constants.Sounds.LevelStart] = this.scene.sound.add(Constants.Sounds.LevelStart)
        this.sounds[Constants.Sounds.correctAnswer] = this.scene.sound.add(Constants.Sounds.correctAnswer)
        this.sounds[Constants.Sounds.wrongAnswer] = this.scene.sound.add(Constants.Sounds.wrongAnswer)
        this.sounds[Constants.Sounds.winGame] = this.scene.sound.add(Constants.Sounds.winGame)
        this.sounds[Constants.Sounds.ExpandScale] = this.scene.sound.add(Constants.Sounds.ExpandScale)

        this.musicVolumeMultiplyer = .5;
        this.SoundVolumeMultiplyer = .5;

        this.musics = {}
        this.musics[Constants.Musics.backMusic] = this.scene.sound.add(Constants.Musics.backMusic)
        this.musics[Constants.Musics.backMusic].play({
            volume: this.scene.game.musicVolume * this.musicVolumeMultiplyer,
            loop: true,
        })
    }

    setMusicVolume(value) {
        this.scene.game.musicVolume = value
        localStorage.setItem("musicVolume", value)
        this.musics[Constants.Musics.backMusic].setVolume(value * this.musicVolumeMultiplyer)        
    }

    setSoundVolume(value) {
        this.scene.game.soundVolume = value
        localStorage.setItem("soundVolume", value)
    }

    play(sound) {
        if (this.scene.game.soundEnabled) {
            this.sounds[sound].play({
                volume: this.scene.game.soundVolume * this.SoundVolumeMultiplyer,
                loop: false,
            })
        }
    }

    playMusic() {
        if (this.scene.game.musicEnabled) {
            if (!this.musics[Constants.Musics.backMusic].isPlaying){
                this.musics[Constants.Musics.backMusic].play({
                    volume: this.scene.game.musicVolume * this.musicVolumeMultiplyer,
                    loop: true,
                })
            }
        }
    }
    
    pauseMusic() {
        this.musics[Constants.Musics.backMusic].stop()
    }

    checkMusic() {
        if (this.scene.game.musicEnabled) {
            if (!this.musics[Constants.Musics.backMusic].isPlaying)
                this.playMusic(Constants.Musics.backMusic)
        } else {
            if (this.musics[Constants.Musics.backMusic].isPlaying)
                this.musics[Constants.Musics.backMusic].pause()
        }
    }
}