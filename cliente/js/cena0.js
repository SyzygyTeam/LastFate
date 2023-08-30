export default class cena0 extends Phaser.Scene {
  constructor () {
    super('cena_0')
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
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen()
        } else {
          this.scale.startFullscreen()
        }
      })

    this.card = this.add.sprite(640, 720, 'card', 0)
      .setScale(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.card.setScale(0.7)
        this.card.y -= 170
      })
      .on('pointerup', () => {
        this.card.setScale(0.5)
        this.card.x = 640
        this.card.y = 720
      })
    this.input.setDraggable(this.card)
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY - 170
    })
  }

  update () { }
}
