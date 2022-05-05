import { Utilities } from "./Utilities"
import { Constants } from "./Constants"

export class Slider {
    constructor(config) {//x, y, width, height, depth, value, min, max) {
        this.config = config
        this.scene = config.scene
        this.onChange = config.onChange
        this.x = config.x
        this.y = config.y
        this.width = config.width
        this.height = config.height
        this.depth = config.depth
        this.value = config.value
        this.min = config.min
        this.max = config.max
        this.enabled = true

        this.trackBg = this.scene.rexUI.add.roundRectangle(0, 0, this.width + 15, this.height + 15, 10, 0X42DDA7).setDepth(this.depth)
        this.track = this.scene.rexUI.add.roundRectangle(this.x, this.y, this.width + 10, this.height + 10, 10, config.bgColor).setDepth(this.depth)
        this.indicator = this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, config.trackColor).setDepth(this.depth + 1)
        this.thumb = this.scene.add.image(0, 10, "sliderThumb").setInteractive({ useHandCursor: true }).setDepth(this.depth + 2)
        // this.thumb = scene.rexUI.add.roundRectangle(0, 0, 40, 40, 15, 0xffffff).setDepth(depth + 2).setInteractive({ useHandCursor: true })

        this.track.followObject = config.followObject
        this.indicator.followObject = this.track
        this.thumb.followObject = this.track
        this.trackBg.followObject = this.track;

        this.thumb.x = Utilities.scaleNumberRange(this.value, this.min, this.max, (-this.width / 2), (this.width / 2))

        this.indicator.x = (- (this.width / 2)) + (this.thumb.x - (- (this.width / 2))) / 2
        this.indicator.width = (this.thumb.x - (- (this.width / 2)))

        this.scene.input.on('pointerdown', this.startDrag, this)
    }

    getValue() {
        return this.value
    }

    disable() {
        this.enabled = false
        this.track.setAlpha(.5)
        this.indicator.setAlpha(0)
        this.thumb.setAlpha(.5)
        this.trackBg.setAlpha(.5)
    }

    enable() {
        this.enabled = true
        this.track.setAlpha(1)
        this.indicator.setAlpha(1)
        this.thumb.setAlpha(1)
        this.trackBg.setAlpha(1)
    }

    startDrag(pointer, targets) {
        if (targets.includes(this.thumb)) {
            this.scene.input.off('pointerdown', this.startDrag, this)
            this.scene.input.on('pointermove', this.doDrag, this)
            this.scene.input.on('pointerup', this.stopDrag, this)
            // this.scene.game.soundManager.play(Constants.Sounds.PopUpSlide)
        }
    }

    doDrag(pointer) {
        if (!this.enabled)
            return
        if (pointer.x < this.track.x - (this.width / 2) * this.scene.globalScale || pointer.x >= this.track.x + (this.width / 2) * this.scene.globalScale) {
            return
        }
        this.thumb.x = pointer.x
        this.thumb.xOriginal = (this.thumb.x - this.thumb.followObject.x) / this.scene.globalScale

        this.value = Utilities.scaleNumberRange(this.thumb.x - (this.track.x - (this.width / 2) * this.scene.globalScale), 0, this.width * this.scene.globalScale, this.min, this.max)

        this.indicator.x = (this.track.x - (this.width / 2) * this.scene.globalScale) + (this.thumb.x - (this.track.x - (this.width / 2) * this.scene.globalScale)) / 2
        this.indicator.width = (this.thumb.x - (this.track.x - (this.width / 2) * this.scene.globalScale)) / this.scene.globalScale

        this.indicator.xOriginal = (this.indicator.x - this.indicator.followObject.x) / this.scene.globalScale

        try { this.onChange(this.value) } catch (e) { }
    }

    stopDrag() {
        this.scene.input.on('pointerdown', this.startDrag, this)
        this.scene.input.off('pointermove', this.doDrag, this)
        this.scene.input.off('pointerup', this.stopDrag, this)
    }
}