/* global Phaser */
export default class logoEntry extends Phaser.Scene {
  constructor () {
    super('logoEntry')
  }

  preload () {

  }

  create () {
    this.bgColor = this.add.rectangle(400, 225, 800, 450, 0x222034, 50)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('mainMenu')
      })
  }

  update (time, delta) {

  }
}
