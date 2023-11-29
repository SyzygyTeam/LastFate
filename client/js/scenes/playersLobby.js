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

    this.load.image('bgPorta', '../../assets/roomLobby/bgPorta.png')

    settings.preloadElements(this)
  }

  create () {
    /* Formatações de texto */
    this.hugeTextFormat = {
      fontFamily: 'PressStart2P',
      fontSize: '30px',
      resolution: 2,
      fill: '#f9f9f9',
      stroke: '#050505',
      strokeThickness: 2,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        fill: true
      }
    }

    this.thinTextFormat = {
      fontFamily: 'VT323',
      fontSize: '50px',
      resolution: 2,
      fill: '#f9f9f9',
      stroke: '#050505',
      strokeThickness: 2,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        fill: true
      }
    }

    /* Mensagens */
    this.game.socket.on('room-status-reply', (playerStatus) => {
      this.playerStatus = playerStatus
      /* Checa se já há texto de status na tela */
      if (this.statusMessage) {
        this.statusRoomNo.destroy()
        this.statusMessage.destroy()
      }
      /* Adiciona o status na tela */
      this.statusRoomNo = this.add.text(400, 200, `Sua sala: ${this.game.roomNo}`, this.thinTextFormat)
        .setOrigin(0.5, 0.5)
      this.statusMessage = this.add.text(400, 250, `Jogadores: ${this.playerStatus} / 2`, this.thinTextFormat)
        .setOrigin(0.5, 0.5)

      if (this.playerStatus === 1) {
        this.waitMessage = this.add.text(400, 350, ['Aguardando', 'segundo jogador...'], this.hugeTextFormat)
          .setAlign('center')
          .setOrigin(0.5, 0.5)
      } else {
        if (this.waitMessage) { this.waitMessage.destroy() }

        this.add.text(400, 350, 'Começando partida!', this.hugeTextFormat)
          .setOrigin(0.5, 0.5)

        this.countdownText = this.add.text(400, 400, '- 5 -', this.hugeTextFormat)
          .setOrigin(0.5, 0.5)

        // TODO: Reverter o countdown para 5
        let countdown = 1
        const countdownInterval = setInterval(() => {
          countdown--
          this.countdownText.setText(`- ${countdown} -`)

          if ((countdown === 0 && this.game.player === 'p1') || (countdown === -1 && this.game.player === 'p2')) {
            clearInterval(countdownInterval)
            this.scene.start('battleMatch')
          }
        }, 1000)
      }
    })

    this.game.socket.emit('room-status-request', this.game.roomNo)

    this.add.image(400, 225, 'bgPorta')
    this.add.rectangle(400, 225, 800, 450, 0x050505, 60)

    settings.displaySettings(this)
  }

  update (time, delta) { }
}
