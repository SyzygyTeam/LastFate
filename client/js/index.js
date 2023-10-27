import config from './config.js'
import roomLobby from './scenes/roomLobby.js'
import mainMenu from './scenes/mainMenu.js'
import battleMatch from './scenes/battleMatch.js'

/* global Phaser */
class Game extends Phaser.Game {
  constructor () {
    super(config)

    /* Conexão do User c/ o Socket */
    /* global io */
    this.socket = io()
    this.socket.on('connect', () => {
      console.log('Connected to server!')
    })

    let iceServers
    if (window.location.host === 'feira-de-jogos.sj.ifsc.edu.br') {
      iceServers = [
        {
          urls: 'stun:feira-de-jogos.sj.ifsc.edu.br'
        },
        {
          urls: 'turns:feira-de-jogos.sj.ifsc.edu.br',
          username: 'adcipt',
          credential: 'adcipt20232'
        }
      ]
    } else {
      iceServers = [
        {
          urls: 'stun:stun.l.google.com:19302'
        }
      ]
    }
    this.iceServers = { iceServers }

    this.audio = document.querySelector('audio')

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
