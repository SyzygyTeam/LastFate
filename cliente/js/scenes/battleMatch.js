import * as settings from '../settingsMenu.js'
import * as cardList from '../cardList.js'
import Card from '../Card.js'

/* Cena p/ as partidas do Game */

/* global Phaser */
export default class battleMatch extends Phaser.Scene {
  constructor () {
    super('battleMatch')
  }

  preload () {
    this.load.image('forest', '../../assets/battleBg/forest.png')
    this.load.image('cardBg', '../../assets/cardsBg/white.png')
    this.load.image('testSprite', '../../assets/cardsSprites/testSprite.png')

    settings.preloadSettings(this)
  }

  create () {
    this.add.sprite(400, 225, 'forest')
      .setInteractive()
      .on('pointerdown', () => {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen()
        } else {
          this.scale.startFullscreen()
        }
      })

    /* Criação dos Cards */
    this.card1 = new Card(this, 400, 440, cardList.giganteLorde)
    this.card2 = new Card(this, 400 * 1.5, 440, cardList.pequenoMago)
    this.card3 = new Card(this, 400 / 2, 440, cardList.bonecoDeTeste)

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY - 70
      if (gameObject.y < 300) {
        gameObject.bgEffect.setVisible(true)
      } else {
        gameObject.bgEffect.setVisible(false)
      }
    })

    settings.displaySettings(this)
  }

  update () {
  }
}
