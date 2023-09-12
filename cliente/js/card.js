export default class card extends Phaser.GameObjects.Container {
  constructor (scene, centerX, centerY, cost) {
    /* Construção do Container */
    super(scene, centerX, centerY)

    /* Valores de Offsets dos elementos */
    this.costOffsetX = -180
    this.costOffsetY = -280

    /* Base do Container - Card Background */
    this.bg_img = scene.add.sprite(0, 0, 'card_bg')
    this.setSize(this.bg_img.width, this.bg_img.height)

    /* Textos */
    this.cost_txt = scene.add.text(
      this.costOffsetX,
      this.costOffsetY,
      cost,
      {
        fontFamily: 'PressStart2P',
        fontSize: '35px'
      })

    /* Adição dos elementos no Container */
    this.add(this.bg_img)
    this.add(this.cost_txt)

    /* Escala Base do Card */
    this.setScale(0.5)

    /* Interatividade */
    this.setInteractive()
    this.on('pointerdown', () => {
      this.setScale(0.7)
      this.y -= 170
    })
    this.on('pointerup', () => {
      this.setScale(0.5)
      this.x = centerX
      this.y = centerY
    })

    /* Adicionar na cena */
    scene.add.existing(this)
    scene.input.setDraggable(this)

    /* Elementos do card */
    this.cost = cost

    /*
    this._name = name
    this.attack = attack
    this.health = health
    this.description = description
    */
  }
}
