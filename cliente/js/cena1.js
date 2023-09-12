import card from './card.js'

export default class cena1 extends Phaser.Scene {
  constructor () {
    super('cena1')
  }

  preload () {
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )
    this.load.image('ifsc-sj-2014', '../assets/ifsc-sj-2014.png')
    this.load.image('card_bg', '../assets/cards_bg/green_bg.png')
  }

  create () {
    /* Font Load */
    WebFont.load({
      custom: {
        families: ['PressStart2P'],
        urls: ['../main.css']
      }
    })

    /* IFSC BG */
    this.add.sprite(640, 360, 'ifsc-sj-2014', 0)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen()
        } else {
          this.scale.startFullscreen()
        }
      })

    this.card = new card(this, 640, 720, '9')
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY - 170
    })
  }

  update () {
  }
}
