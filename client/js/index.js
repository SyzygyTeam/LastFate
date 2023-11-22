import config from './config.js'
import logoEntry from './scenes/logoEntry.js'
import mainMenu from './scenes/mainMenu.js'
import roomLobby from './scenes/roomLobby.js'
import playersLobby from './scenes/playersLobby.js'
import battleMatch from './scenes/battleMatch.js'
import claimCredits from './scenes/claimCredits.js'

/* global Phaser */
class Game extends Phaser.Game {
  constructor () {
    super(config)

    /* Funções de crédito */
    this.id = 1 // Nº do jogo (indentificação)
    this.value = 100 // 'Valor' padrão do crédito

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
    this.scene.add('logoEntry', logoEntry)
    this.scene.add('mainMenu', mainMenu)
    this.scene.add('roomLobby', roomLobby)
    this.scene.add('playersLobby', playersLobby)
    this.scene.add('battleMatch', battleMatch)
    this.scene.add('claimCredits', claimCredits)

    /* Cena de início */
    this.scene.start('logoEntry')
  }
}

window.onload = () => {
  window.game = new Game()
}
