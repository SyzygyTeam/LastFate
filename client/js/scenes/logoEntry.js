/* global Phaser */
export default class logoEntry extends Phaser.Scene {
  constructor () {
    super('logoEntry')
  }

  preload () {
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )
  }

  create () {
    this.bgColor = this.add.rectangle(400, 225, 800, 450, 0x222034, 50)
      .setInteractive()
      .on('pointerdown', () => {
        // this.bgColor.disableInteractive()
        // this.cameras.main.fadeOut(400, 0, 0, 0)
        // this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('mainMenu')
        // })
      })

    /* global WebFont */
    WebFont.load({
      custom: {
        families: ['PressStart2P'],
        urls: ['../main.css']
      }
    })

    WebFont.load({
      custom: {
        families: ['VT323'],
        urls: ['../main.css']
      }
    })
  }

  update (time, delta) { }
}
