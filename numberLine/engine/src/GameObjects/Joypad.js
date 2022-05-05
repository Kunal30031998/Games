export class Joypad {

    constructor(scene) {
        this.scene = scene
    }

    create() {
        this.Buttons = this.scene.add.image(this.scene.screenWidth * .875, this.scene.screenHeight * .85, 'Buttons').setOrigin(0.5)

        let alpha = 0
        let radius = 60
        // let center = this.scene.add.graphics().setInteractive(new Phaser.Geom.Circle(0, 0, 70), Phaser.Geom.Circle.Contains).setPosition(this.Buttons.x, this.Buttons.y)
        //     .fillStyle(0xffffff, alpha).fillCircle(0, 0, 70).on('pointerup', () => {
        //         console.log('Center', this.scene.player.position)
        //     })
        this.scene.add.graphics().setInteractive(new Phaser.Geom.Circle(0, 0, radius), Phaser.Geom.Circle.Contains).setPosition(0 - 90, 0)
            .fillStyle(0xffffff, alpha).fillCircle(0, 0, radius).on('pointerup', () => {
                this.scene.player.moveLeft()
            }).followObject = this.Buttons
        this.scene.add.graphics().setInteractive(new Phaser.Geom.Circle(0, 0, radius), Phaser.Geom.Circle.Contains).setPosition(+ 90, 0)
            .fillStyle(0xffffff, alpha).fillCircle(0, 0, radius).on('pointerup', () => {
                this.scene.player.moveRight()
            }).followObject = this.Buttons
        this.scene.add.graphics().setInteractive(new Phaser.Geom.Circle(0, 0, radius), Phaser.Geom.Circle.Contains).setPosition(0, - 90)
            .fillStyle(0xffffff, alpha).fillCircle(0, 0, radius).on('pointerup', () => {
                this.scene.player.moveUp()
            }).followObject = this.Buttons
        this.scene.add.graphics().setInteractive(new Phaser.Geom.Circle(0, 0, radius), Phaser.Geom.Circle.Contains).setPosition(0, + 90)
            .fillStyle(0xffffff, alpha).fillCircle(0, 0, radius).on('pointerup', () => {
                this.scene.player.moveDown()
            }).followObject = this.Buttons
        // this.scene.add.graphics().setInteractive(new Phaser.Geom.Circle(0, 0, 50), Phaser.Geom.Circle.Contains).setPosition(- 100, + 100)
        //     .fillStyle(0xffffff, alpha).fillCircle(0, 0, 50).on('pointerup', () => {
        //         this.scene.player.moveDownLeft()
        //     }).followObject = this.Buttons
        // this.scene.add.graphics().setInteractive(new Phaser.Geom.Circle(0, 0, 50), Phaser.Geom.Circle.Contains).setPosition(+ 100, + 100)
        //     .fillStyle(0xffffff, alpha).fillCircle(0, 0, 50).on('pointerup', () => {
        //         this.scene.player.moveDownRight()
        //     }).followObject = this.Buttons
        // this.scene.add.graphics().setInteractive(new Phaser.Geom.Circle(0, 0, 50), Phaser.Geom.Circle.Contains).setPosition(+ 100, - 100)
        //     .fillStyle(0xffffff, alpha).fillCircle(0, 0, 50).on('pointerup', () => {
        //         this.scene.player.moveUpRight()
        //     }).followObject = this.Buttons
        // this.scene.add.graphics().setInteractive(new Phaser.Geom.Circle(0, 0, 50), Phaser.Geom.Circle.Contains).setPosition(- 100, - 100)
        //     .fillStyle(0xffffff, alpha).fillCircle(0, 0, 50).on('pointerup', () => {
        //         this.scene.player.moveUpLeft()
        //     }).followObject = this.Buttons
    }
}