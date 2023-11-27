import * as settings from '../settingsMenu.js'

/* Cena de seleção de salas */

/* global Phaser */
export default class roomLobby extends Phaser.Scene {
  constructor () {
    super('roomLobby')
  }

  preload () {
    this.load.image('bgPorta', '../../assets/roomLobby/bgPorta.png')
    this.load.image('createRoom', '../../assets/roomLobby/createRoom.png')
    this.load.image('enterRoom', '../../assets/roomLobby/enterRoom.png')
    settings.preloadElements(this)
  }

  create () {
    /* Formatações de texto */
    this.keyboardFormat = {
      fontFamily: 'VT323',
      fontSize: '70px',
      resolution: 2,
      color: '#f9f9f9',
      stroke: '#050505',
      strokeThickness: 2,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        fill: true
      }
    }

    this.titleFormat = {
      fontFamily: 'PressStart2P',
      fontSize: '23px',
      resolution: 2,
      color: '#f9f9f9',
      stroke: '#050505',
      strokeThickness: 2,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        fill: true
      }
    }

    this.add.image(400, 225, 'bgPorta')
    this.add.rectangle(400, 225, 800, 450, 0x050505, 60)

    this.titleText = this.add.text(400, 50, 'Junte-se a sua dupla!', this.titleFormat)
      .setOrigin(0.5, 0)

    this.orText = this.add.text(400, 225, 'ou', this.titleFormat)
      .setOrigin(0.5, 0)

    /* Mensagens do server */
    /* Entrou normalmente numa sala */
    this.game.socket.on('enter-room-ok', (room) => {
      this.game.roomNo = room.no
      this.scene.start('playersLobby')
    })

    /* Sala inserida não existe */
    this.game.socket.on('enter-room-404', (room) => {
      this.errorMessage = this.add.text(400, 120, `Sala ${room.no} não existe`, this.titleFormat)
        .setOrigin(0.5, 0)
      this.onError = true
      for (let i = 0; i < 4; i++) {
        this.removeChar(i)
      }
    })

    /* Sala inserida já possui dois jogadores (Cheio) */
    this.game.socket.on('enter-room-full', (room) => {
      this.errorMessage = this.add.text(400, 120, `Sala ${room.no} está cheia`, this.titleFormat)
        .setOrigin(0.5, 0)
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

    this.backspaceKey = this.add.text(340, 360, '<', {
      fontFamily: 'VT323',
      fontSize: '70px',
      fill: '#f90505',
      resolution: 2,
      stroke: '#050505',
      strokeThickness: 2,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        fill: true
      }
    })
      .setInteractive()
      .on('pointerdown', () => {
        this.removeChar()
      })
      .setOrigin(0.5, 0)
      .setVisible(false)

    this.zeroKey = this.add.text(400, 360, 0, {
      fontFamily: 'VT323',
      fontSize: '70px',
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
      .setInteractive()
      .on('pointerdown', () => {
        this.press(0)
      })
      .setOrigin(0.5, 0)
      .setVisible(false)

    this.okKey = this.add.text(460, 360, 'OK', {
      fontFamily: 'VT323',
      fontSize: '70px',
      fill: '#05f905',
      resolution: 2,
      stroke: '#050505',
      strokeThickness: 2,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        fill: true
      }
    })
      .setInteractive()
      .on('pointerdown', () => {
        this.confirm()
      })
      .setOrigin(0.5, 0)
      .setVisible(false)

    /* Botão de criar sala aleatória */
    this.createRoom = this.add.sprite(400, 200, 'createRoom')
      .setInteractive()
      .on('pointerdown', () => {
        this.game.player = 'p1'
        this.game.socket.emit('create-room')
      })

    /* Botão de revelar teclado */
    this.enterRoom = this.add.sprite(400, 285, 'enterRoom')
      .setInteractive()
      .on('pointerdown', () => {
        this.titleText.setText('Digite o código da sala')
        this.createRoom.setVisible(false)
        this.orText.setVisible(false)
        this.enterRoom.setVisible(false)

        for (let i = 0; i < 9; i++) {
          this.numerals[i].setVisible(true)
        }
        this.zeroKey.setVisible(true)
        this.okKey.setVisible(true)
        this.backspaceKey.setVisible(true)
      })

    settings.displaySettings(this)
    this.cameras.main.fadeIn(1000)
  }

  /* Cria o teclado 1 ~ 9 */
  createKeyboard () {
    this.numerals = Array(9).fill(undefined)
    for (let i = 0; i < 9; i++) {
      this.numerals[i] = this.add.text(
        60 * ((i % 3) + 1) + 280,
        60 * (Math.floor(i / 3) + 1) + 120,
        i + 1,
        this.keyboardFormat)
        .setOrigin(0.5, 0)
        .setInteractive()
        .on('pointerdown', () => {
          this.press(i + 1)
        })
        .setVisible(false)
    }
  }

  /* Apertar algum botão numeral */
  press (value) {
    /* Checa se irá exceder o limite de char das salas (4) */
    if (this.displayText.length === 4) { return }

    if (this.onError === true) {
      this.errorMessage.destroy()
      this.onError = false
    }

    const txt = this.add.text(300 + (this.displayText.length * 65), 120, value, {
      fontFamily: 'PressStart2P',
      fontSize: '23px',
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
