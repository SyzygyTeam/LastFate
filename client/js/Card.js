/* Classe que gera, define e gerencia os Cards */
/* Utiliza como base a classe 'Container' do Phaser */

/* global Phaser */
export default class Card extends Phaser.GameObjects.Container {
  constructor (scene, centerX, centerY, cardInfo) {
    /* Construção do Container */
    super(scene, centerX, centerY)

    /* Definição da cena do Game */
    this.scene = scene

    /* Definição de valores p/ criação de txt */
    this.costTxt = null
    this.attackTxt = null
    this.healthTxt = null

    this.arrValues = [cardInfo.cost, cardInfo.attack, cardInfo.health]
    this.arrTxtElements = [this.costTxt, this.attackTxt, this.healthTxt]

    /* Valores de posição dos elementos */
    this.costPos = [-100, -160]
    this.attackPos = [-100, 140]
    this.healthPos = [100, 140]
    this.arrPosElements = [this.costPos, this.attackPos, this.healthPos]

    /* Sprites */
    this.sprite = cardInfo.path
    this.bgImg = this.scene.add.sprite(0, 0, 'cardBg')
    this.spriteImg = this.scene.add.sprite(0, -50, this.sprite)
    this.setSize(this.bgImg.width, this.bgImg.height)
    this.equalizeScale()

    /* Efeito de Hover de Board */
    this.bgEffect = this.scene.add.rectangle(
      0,
      0,
      260,
      360,
      0xFAFAFA
    ).setVisible(false)

    this.effectCounter = this.scene.tweens.addCounter({
      from: 0.2,
      to: 0.8,
      duration: 500,
      yoyo: true,
      loop: -1,
      onUpdate: (tween) => {
        const alpha = tween.getValue().toFixed(2)
        this.bgEffect.setAlpha(alpha)
      }
    })

    /* Texto de Título e Descrição */
    this.nameTxt = this.scene.add.text(
      20,
      -157,
      cardInfo.name,
      {
        resolution: 8,
        fontFamily: 'PressStart2P',
        fill: '#050505',
        fontSize: '15px'
      }
    )
      .setOrigin(0.5, 0)

    this.descriptionTxt = this.scene.add.text(
      0,
      55,
      cardInfo.description,
      {
        fontFamily: 'PressStart2P',
        fontSize: '15px',
        resolution: 8,
        fill: '#050505',
        align: 'center',
        wordWrap: {
          width: 250,
          useAdvancedWrap: true
        }
      }
    )
      .setOrigin(0.5, 0)

    /* Adição dos elementos no Container */
    this.add(this.bgEffect)
    this.add(this.bgImg)
    this.add(this.spriteImg)
    this.add(this.nameTxt)
    this.add(this.descriptionTxt)
    this.generateTxtValues() // Loop p/ implementação do texto de valores

    /* Escala Base */
    this.setScale(0.7)

    /* Interatividade */
    this.setInteractive()
    this.on('pointerdown', () => {
      this.setScale(1)
      this.y -= 70
      this.effectCounter.paused = false
    })

    this.on('pointerup', () => {
      this.effectCounter.paused = true
      if (this.y < 300) {
        this.play()
      }
      this.setScale(0.7)
      this.x = centerX
      this.y = centerY
    })

    /* Adicionar Container na cena */
    this.scene.add.existing(this)
    this.scene.input.setDraggable(this)

    /* Elementos e Valores */
    this._name = cardInfo.name
    this.cost = cardInfo.cost
    this.attack = cardInfo.attack
    this.health = cardInfo.health
    this.description = cardInfo.description

    this.sendInfo = {
      sprite: this.sprite,
      name: this.nameTxt
    }
  }

  generateTxtValues () {
    /* Loop p/ geração dos valores numéricos */
    for (let i = 0; i < this.arrValues.length; i++) {
      this.arrTxtElements[i] = this.scene.add.text(
        this.arrPosElements[i][0],
        this.arrPosElements[i][1],
        this.arrValues[i],
        {
          fontFamily: 'PressStart2P',
          fontSize: '20px',
          resolution: 2,
          fill: '#f9f9f9',
          stroke: '#050505',
          strokeThickness: 2,
          shadow: {
            offsetX: 4,
            offsetY: 4,
            fill: true
          }
        })
        .setOrigin(0.5, 0)

      this.add(this.arrTxtElements[i])
    }
  }

  equalizeScale () {
    const imageSize = this.spriteImg.width * this.spriteImg.height
    const targetSize = 128 * 128 // Change this to the desired target size

    const scale = Math.sqrt(targetSize / imageSize)
    this.spriteImg.setScale(scale)

    // If you want to maintain the aspect ratio, you can use the following code instead:
    // const maxDimension = Math.max(spriteImg.width, spriteImg.height);
    // const scale = targetSize / maxDimension;
    // spriteImg.setScale(scale);
  }

  play () {
    this.scene.playCard(this.sendInfo, this)
  }
}
