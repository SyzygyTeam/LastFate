import * as settings from '../settingsMenu.js'

/* Cena de seleção de salas */

/* global Phaser */
export default class roomLobby extends Phaser.Scene {
  constructor () {
    super('roomLobby')
  }

  preload () {
    settings.preloadElements(this)
  }

  create () {
    /* Mensagens do server */

    /* Entrou normalmente numa sala */
    this.game.socket.on('enter-room-ok', (room) => {
      this.game.roomNo = room.no
      this.scene.start('playersLobby')
    })

    /* Sala inserida não existe */
    this.game.socket.on('enter-room-404', (room) => {
      this.errorMessage = this.add.text(300, 300, `Sala ${room.no} não existe`)
      this.onError = true
      for (let i = 0; i < 4; i++) {
        this.removeChar(i)
      }
    })

    /* Sala inserida já possui dois jogadores (Cheio) */
    this.game.socket.on('enter-room-full', (room) => {
      this.errorMessage = this.add.text(300, 300, `Sala ${room.no} está cheia`)
      this.onError = true
      for (let i = 0; i < 4; i++) {
        this.removeChar(i)
      }
    })

    this.game.socket.on('players', (players) => {
      console.log(players)
    })

    /* Exibição e valores teclados pelo Player */
    this.displayText = []
    this.typedRoom = []
    this.onError = false

    /* Criação do Teclado Virtual */
    this.createKeyboard()

    this.add.text(100, 200, 0)
      .setInteractive()
      .on('pointerdown', () => {
        this.press(0)
      })
    this.add.text(150, 200, 'OK')
      .setInteractive()
      .on('pointerdown', () => {
        this.confirm()
      })
    this.add.text(50, 200, '<')
      .setInteractive()
      .on('pointerdown', () => {
        this.removeChar()
      })

    /* Botão de criar sala aleatória */
    this.createRoom = this.add.text(50, 300, 'Criar Sala')
      .setInteractive()
      .on('pointerdown', () => {
        this.game.player = 'p1'
        this.game.socket.emit('create-room')
      })

    settings.displaySettings(this)
  }

  /* Cria o teclado 1 ~ 9 */
  createKeyboard () {
    for (let i = 0; i < 9; i++) {
      this.add.text(50 * ((i % 3) + 1), 50 * (Math.floor(i / 3) + 1), i + 1)
        .setInteractive()
        .on('pointerdown', () => {
          this.press(i + 1)
        })
    }
  }

  /* Apertar algum botão numeral */
  press (value) {
    /* Checa se irá exceder o limite de char das salas (4) */
    if (this.displayText.length === 4) { return }

    const txt = this.add.text(300 + (this.displayText.length * 10), 200, value)
    this.displayText.push(txt)
    this.typedRoom.push(value)
  }

  /* Confirmar o valor teclado e emite 'enter-room' ao server */
  confirm () {
    /* Checa se está c/ a qntdd de char está correto */
    if (this.displayText.length < 4) { return }

    if (this.onError === true) {
      this.errorMessage.destroy()
      this.onError = false
    }

    this.game.player = 'p2'

    const codeRoom = Number(this.typedRoom.join(''))
    this.game.socket.emit('enter-room', codeRoom)
  }

  /* Remove o último caractere teclado */
  removeChar () {
    /* Checa se o campo está vazio */
    if (this.displayText.length === 0) { return }

    this.typedRoom.pop()
    this.displayText.pop().destroy()
  }

  update (time, delta) { }
}
