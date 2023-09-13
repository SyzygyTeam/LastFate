export default class Card extends Phaser.GameObjects.Container {
  constructor (scene, centerX, centerY, cost, attack, health) {
    /* Construção do Container */
    super(scene, centerX, centerY)

    this.scene = scene

    /* Definição de valores p/ criação de txt */
    /* null é de caráter provisório */
    this.costTxt = null
    this.attackTxt = null
    this.healthTxt = null

    this.costTxtShadow = null
    this.attackTxtShadow = null
    this.healthTxtShadow = null

    this.arrValues = [cost, attack, health]
    this.arrTxtElements = [this.costTxt, this.attackTxt, this.healthTxt]
    this.arrTxtShadowElements = [this.costTxtShadow, this.attackTxtShadow, this.healthTxtShadow]

    /* Valores de posição dos elementos */
    this.costPos = [-180, -280]
    this.attackPos = [-180, 245]
    this.healthPos = [140, 245]
    this.arrPosElements = [this.costPos, this.attackPos, this.healthPos]

    /* Valor de offset das sombras */
    this.shadowOffset = 3

    /* Base do Container - Card Background */
    this.bgImg = this.scene.add.sprite(0, 0, 'card_bg')
    this.setSize(this.bgImg.width, this.bgImg.height)

    /* Adição dos elementos no Container */
    this.add(this.bgImg)
    this.generate_txt()

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
    // this._name = name
    this.attack = attack
    this.health = health
    // this.description = description
  }

  generate_txt () {
    for (let i = 0; i < this.arrValues.length; i++) {
      this.arrTxtElements[i] = this.scene.add.text(
        this.arrPosElements[i][0],
        this.arrPosElements[i][1],
        this.arrValues[i],
        {
          fontFamily: 'PressStart2P',
          fontSize: '35px',
          fill: 'white'
        })

      this.arrTxtShadowElements[i] = this.scene.add.text(
        this.arrPosElements[i][0] + this.shadowOffset,
        this.arrPosElements[i][1] + this.shadowOffset,
        this.arrValues[i],
        {
          fontFamily: 'PressStart2P',
          fontSize: '34px',
          fill: 'black'
        })
      this.add(this.arrTxtShadowElements[i])
      this.add(this.arrTxtElements[i])
    }
  }
}
