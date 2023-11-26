import * as settings from '../settingsMenu.js'

/* Cena de menu principal */
/* Fontes precisam serem carregadas aqui p/ funcionarem em cenas posteriores */

/* global Phaser */
export default class playersLobby extends Phaser.Scene {
  constructor () {
    super('playersLobby')
  }

  preload () {
    /* VOIP P1 */
    if (this.game.player === 'p1') {
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          console.log(stream)
          this.game.midias = stream
        })
        .catch((error) => console.log(error))
    }

    this.load.image('forest', '../../assets/battleBg/forest.png')

    settings.preloadElements(this)
  }

  create () {
    /* Mensagens */
    this.game.socket.on('room-status-reply', (playerStatus) => {
      this.playerStatus = playerStatus
      /* Checa se já há texto de status na tela */
      if (this.statusMessage) {
        this.statusRoomNo.destroy()
        this.statusMessage.destroy()
      }
      /* Adiciona o status na tela */
      this.statusRoomNo = this.add.text(20, 20, `Sua sala: ${this.game.roomNo}`)
      this.statusMessage = this.add.text(20, 40, `Jogadores: ${this.playerStatus} / 2`)
    })

    this.game.socket.emit('room-status-request', this.game.roomNo)

    this.add.text(400, 225, 'ENTRAR')
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('battleMatch')
      })

    settings.displaySettings(this)
  }

  update (time, delta) { }
}
