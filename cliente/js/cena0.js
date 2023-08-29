export default class cena0 extends Phaser.Scene {
  constructor () {
    super('cena_0')
  }

  preload () {
    this.load.image('ifsc-sj-2014', '../assets/ifsc-sj-2014.png')
    this.load.image('card', '../assets/cards_bg/green_bg.png')
  }

  create () {
    this.add.image(640, 360, 'ifsc-sj-2014')
    this.card = this.add.sprite(200, 200, 'card', 0)
      .setInteractive()
      .on('pointerdown', () => { })
    this.input.setDraggable(this.card)
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY
    })
  }

  update () { }
}
