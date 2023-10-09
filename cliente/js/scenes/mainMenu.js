import * as settings from '../settingsMenu.js'

/* Cena de menu principal */
/* Fontes precisam serem carregadas aqui p/ funcionarem em cenas posteriores */

/* global Phaser */
export default class mainMenu extends Phaser.Scene {
  constructor () {
    super('mainMenu')
  }

  preload () {
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )
    this.load.image('forest', '../../assets/battleBg/forest.png')

    settings.preloadSettings(this)
  }

  create () {
    /* global WebFont */
    WebFont.load({
      custom: {
        families: ['PressStart2P'],
        urls: ['../main.css']
      }
    })

    this.add.sprite(400, 225, 'forest')
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('battleMatch')
      })

    this.add.text(20, 20, `Sua sala: ${this.game.roomNo}`)
    settings.displaySettings(this)
  }

  update () { }
}
