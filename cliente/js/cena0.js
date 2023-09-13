export default class cena0 extends Phaser.Scene {
  constructor () {
    super('cena0')
  }

  preload () {
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )
    this.load.image('ifsc-sj-2014', '../assets/ifsc-sj-2014.png')
    this.load.image('card', '../assets/cards_bg/green_bg.png')
  }

  create () {
    WebFont.load({
      custom: {
        families: ['PressStart2P'],
        urls: ['../main.css']
      }
    })

    this.add.sprite(640, 360, 'ifsc-sj-2014')
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('cena1')
      })
  }

  update () { }
}
