/* global Phaser */
export default class roomLobby extends Phaser.Scene {
  constructor () {
    super('roomLobby')
  }

  preload () { }

  create () {
    /* Exibição e valores teclados pelo Player */
    this.displayText = []
    this.typedRoom = []

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
        this.game.socket.emit('create-room')
        this.scene.start('mainMenu')
        this.game.socket.on('players', (players) => {
          console.log(players)
        })
      })
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

  /* Func de apertar o botão */
  press (value) {
    /* Checa se irá exceder o limite de char das salas (4) */
    if (this.displayText.length === 4) { return }

    const txt = this.add.text(300 + (this.displayText.length * 10), 200, value)
    this.displayText.push(txt)
    this.typedRoom.push(value)
  }

  /* Confirma o valor teclado e emite 'enter-room' ao servidor */
  confirm () {
    /* Checa se está c/ a qntdd de char está correto */
    if (this.displayText.length < 4) { return }

    const codeRoom = Number(this.typedRoom.join(''))
    this.game.socket.emit('enter-room', codeRoom)

    // TODO: Evitar o avanço de cena caso a sala teclada ñ exista
    this.scene.start('mainMenu')
    this.game.socket.on('players', (players) => {
      console.log(players)
    })
  }

  /* Remove o último char teclado */
  removeChar () {
    /* Checa se o campo está vazio */
    if (this.displayText.length === 0) { return }

    this.typedRoom.pop()
    const removedChar = this.displayText.pop()
    removedChar.destroy()
  }

  update () { }
}
