import config from './config.js'
import roomLobby from './scenes/roomLobby.js'
import mainMenu from './scenes/mainMenu.js'
import battleMatch from './scenes/battleMatch.js'

/* global Phaser */
class Game extends Phaser.Game {
  constructor () {
    super(config)

    /* Conexão do User c/ o Socket */
    this.socket = io() /* global io */
    this.socket.on('connect', () => {
      console.log('Connected to server!')
    })

    /* Todas as cenas */
    this.scene.add('roomLobby', roomLobby)
    this.scene.add('mainMenu', mainMenu)
    this.scene.add('battleMatch', battleMatch)

    /* Cena de início */
    this.scene.start('roomLobby')
  }
}

window.onload = () => {
  window.game = new Game()
}
