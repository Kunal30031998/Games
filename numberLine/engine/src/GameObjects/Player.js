export class Player {
    constructor(scene, x, y, sizeX, sizeY) {
        this.scene = scene
        this.x = x
        this.y = y
        this.position = {
            x: 0,
            y: 0
        }
        this.moveDistanceX = sizeX
        this.moveDistanceY = sizeY
        this.bound = {
            x: 3,
            y: 3
        }
        this.once = true
        this.vibrate = 0
        this.playerMoves = []
        this.stopMovement = false
    }

    reset(x, y) {
        this.x = x
        this.y = y
        this.position = {
            x: 0,
            y: 0
        }
        this.bound = {
            x: 3,
            y: 3
        }
        this.stopMovement = false
        this.once = true
        this.vibrate = 0
        this.playerMoves = []
        this.sprite.x = x * this.scene.scaleX
        this.sprite.y = y * this.scene.scaleY
        this.sprite.angle = 0
    }

    create() {
        this.sprite = this.scene.add.image(this.x * this.scene.scaleX, this.y * this.scene.scaleY, 'player').setOrigin(0.5).setDepth(20)
    }

    update() {
        if (this.vibrate > 0) {
            let diff = Phaser.Math.Between(0, 100) % 2 == 0 ? 1 : -1
            this.sprite.x = this.sprite.xOriginal + diff
            diff = Phaser.Math.Between(0, 100) % 2 == 0 ? 1 : -1
            this.sprite.y = this.sprite.yOriginal + diff
            this.vibrate--
            if (this.vibrate == 0) {
                this.sprite.x = this.sprite.xOriginal
                this.sprite.y = this.sprite.yOriginal
                this.backTrace()
            }
            return
        }
        let target = {
            x: this.x * this.scene.scaleX + this.position.x * this.scene.globalScale * this.moveDistanceX,
            y: this.y * this.scene.scaleY - this.position.y * this.scene.globalScale * this.moveDistanceY
        }
        if (Phaser.Math.Distance.BetweenPoints(this.sprite, target) > 1) {
            this.sprite.xOriginal = Phaser.Math.Linear(this.sprite.xOriginal, target.x, .1)
            this.sprite.yOriginal = Phaser.Math.Linear(this.sprite.yOriginal, target.y, .1)
            this.sprite.x = this.sprite.xOriginal
            this.sprite.y = this.sprite.yOriginal
            this.once = true
        } else if (this.once) {
            this.stopMovement = false
            this.sprite.xOriginal = target.x
            this.sprite.yOriginal = target.y
            this.sprite.x = this.sprite.xOriginal
            this.sprite.y = this.sprite.yOriginal
            if (this.scene.checkCollision(this.position.x, this.position.y)) {
                this.vibrate = 20
            } else {
                this.scene.checkAnswer(this.position.x, this.position.y)
            }
            this.once = false
        }
    }

    backTrace() {
        let lastMove = this.playerMoves[this.playerMoves.length - 1]
        switch (lastMove) {
            case "moveDown":
                this.moveUp(false)
                break
            case "moveUp":
                this.moveDown(false)
                break
            case "moveRight":
                this.moveLeft(false)
                break
            case "moveLeft":
                this.moveRight(false)
                break
            case "moveDownLeft":
                this.moveUpRight(false)
                break
            case "moveDownRight":
                this.moveUpLeft(false)
                break
            case "moveUpRight":
                this.moveDownLeft(false)
                break
            case "moveUpLeft":
                this.moveDownRight(false)
                break
            default:
                break
        }
    }

    moveDown(rotate = true) {
        if (this.position.y <= -this.bound.y)
            return
        if (this.stopMovement)
            return
        this.stopMovement = true
        if (rotate)
            this.sprite.angle = 180
        this.position.y -= 1
        this.playerMoves.push("moveDown")
    }

    moveUp(rotate = true) {
        if (this.position.y >= this.bound.y)
            return
        if (this.stopMovement)
            return
        this.stopMovement = true
        if (rotate)
            this.sprite.angle = 0
        this.position.y += 1
        this.playerMoves.push("moveUp")
    }

    moveRight(rotate = true) {
        if (this.position.x >= this.bound.x)
            return
        if (this.stopMovement)
            return
        this.stopMovement = true
        if (rotate)
            this.sprite.angle = 90
        this.position.x += 1
        this.playerMoves.push("moveRight")
    }

    moveLeft(rotate = true) {
        if (this.position.x <= -this.bound.x)
            return
        if (this.stopMovement)
            return
        this.stopMovement = true
        if (rotate)
            this.sprite.angle = -90
        this.position.x -= 1
        this.playerMoves.push("moveLeft")
    }

    moveDownLeft(rotate = true) {
        if (this.position.y <= -this.bound.y || this.position.x <= -this.bound.x)
            return
        if (this.stopMovement)
            return
        this.stopMovement = true
        if (rotate)
            this.sprite.angle = -135
        this.position.x -= 1
        this.position.y -= 1
        this.playerMoves.push("moveDownLeft")
    }

    moveDownRight(rotate = true) {
        if (this.position.y <= -this.bound.y || this.position.x >= this.bound.x)
            return
        if (this.stopMovement)
            return
        this.stopMovement = true
        if (rotate)
            this.sprite.angle = 135
        this.position.x += 1
        this.position.y -= 1
        this.playerMoves.push("moveDownRight")
    }

    moveUpRight(rotate = true) {
        if (this.position.y >= this.bound.y || this.position.x >= this.bound.x)
            return
        if (this.stopMovement)
            return
        this.stopMovement = true
        if (rotate)
            this.sprite.angle = 45
        this.position.x += 1
        this.position.y += 1
        this.playerMoves.push("moveUpRight")
    }

    moveUpLeft(rotate = true) {
        if (this.position.y >= this.bound.y || this.position.x <= -this.bound.x)
            return
        if (this.stopMovement)
            return
        this.stopMovement = true
        if (rotate)
            this.sprite.angle = -45
        this.position.x -= 1
        this.position.y += 1
        this.playerMoves.push("moveUpLeft")
    }
}