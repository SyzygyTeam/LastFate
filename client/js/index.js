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

    this.ice_servers = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ]
    }
    // eslint-disable-next-line quotes
    this.audio = document.querySelector("audio")

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
