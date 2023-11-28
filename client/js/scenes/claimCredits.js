import * as settings from '../settingsMenu.js'

/* Cena p/ resgate de Tijolinhos */

/* global Phaser */
export default class claimCredits extends Phaser.Scene {
  constructor () {
    super('claimCredits')
  }

  preload () {
    this.load.audio('key', '../../assets/roomLobby/key.mp3')
    this.load.audio('back', '../../assets/roomLobby/back.mp3')
    this.load.audio('confirm', '../../assets/roomLobby/confirm.mp3')

    settings.preloadElements(this)
  }

  create () {
    this.backSound = this.sound.add('back')
    this.keySound = this.sound.add('key')
    this.confirmSound = this.sound.add('confirm')

    this.posicao = ''

    this.usuarioTextoBase = 'Usuário: '
    this.usuarioDigitado = ''
    this.usuario = this.add.text(450, 100, this.usuarioTextoBase, {
      fontFamily: 'monospace',
      font: '32px Courier',
      fill: '#cccccc'
    })
      .setInteractive()
      .on('pointerdown', () => {
        this.posicao = 'usuário'
        this.usuario.setFill('#ffffff')
        this.senha.setFill('#cccccc')
        this.voltar.x = 750
        this.voltar.y = this.usuario.y
      })

    this.senhaTextoBase = 'Senha: '
    this.senhaDigitada = ''
    this.senha = this.add.text(450, 200, this.senhaTextoBase, {
      fontFamily: 'monospace',
      font: '32px Courier',
      fill: '#cccccc'
    })
      .setInteractive()
      .on('pointerdown', () => {
        this.posicao = 'senha'
        this.usuario.setFill('#cccccc')
        this.senha.setFill('#ffffff')
        this.voltar.x = 750
        this.voltar.y = this.senha.y
      })

    const teclado = [...Array(10).keys()]
    teclado.forEach(digito => {
      const valor = (digito + 1) % 10
      this.add.text(80 * ((digito % 3) + 1), 80 * (Math.floor(digito / 3) + 1), valor, {
        fontFamily: 'monospace',
        font: '32px Courier',
        fill: '#ffffff'
      })
        .setInteractive()
        .on('pointerdown', () => {
          this.keySound.play()
          if (this.posicao === 'usuário') {
            if (this.usuarioDigitado.length < 4) {
              this.usuarioDigitado += valor
              this.usuario.text = this.usuarioTextoBase + this.usuarioDigitado
            }
          } else if (this.posicao === 'senha') {
            if (this.senhaDigitada.length < 4) {
              this.senhaDigitada += valor
              let senhaOculta = ''
              Array.from(this.senhaDigitada).forEach(numero => {
                senhaOculta += '*'
              })
              this.senha.text = this.senhaTextoBase + senhaOculta
            }
          }
          if (this.usuarioDigitado.length === 4 && this.senhaDigitada.length === 4) {
            this.enviar = this.add.text(450, 300, '[ENVIAR]', {
              fontFamily: 'monospace',
              font: '64px Courier',
              fill: '#ffffff'
            })
              .setInteractive()
              .on('pointerdown', () => {
                this.confirmSound.play()
                this.serverInteraction()
              })
          }
        })
    })

    this.voltar = this.add.text(800, 100, '<', {
      fontFamily: 'monospace',
      font: '32px Courier',
      fill: '#ffffff'
    })
      .setInteractive()
      .on('pointerdown', () => {
        this.backSound.play()
        if (this.posicao === 'usuário') {
          if (this.usuarioDigitado.length > 0) {
            this.usuarioDigitado = this.usuarioDigitado.slice(0, -1)
            this.usuario.text = this.usuarioTextoBase + this.usuarioDigitado
          }
        } else if (this.posicao === 'senha') {
          if (this.senhaDigitada.length > 0) {
            this.senhaDigitada = this.senhaDigitada.slice(0, -1)
            let senhaOculta = ''
            Array.from(this.senhaDigitada).forEach(numero => {
              senhaOculta += '*'
            })
            this.senha.text = this.senhaTextoBase + senhaOculta
          }
        }

        if (this.usuarioDigitado.length !== 4 || this.senhaDigitada.length !== 4) {
          try {
            this.enviar.destroy()
          } catch (error) {
            console.error(error)
          }
        }
      })
    settings.displaySettings(this)
  }

  serverInteraction () {
    /* global axios */
    axios.post('https://feira-de-jogos.sj.ifsc.edu.br/api/v1/credito', {
      id: this.usuarioDigitado,
      senha: this.senhaDigitada,
      jogo: this.game.id,
      valor: this.game.value
    })
      .then((response) => {
        if (response.status === 200) {
          this.enviar.destroy()
          this.tempo = 2
          this.relogio = this.time.addEvent({
            delay: 1000,
            callback: () => {
              this.tempo--
              if (this.tempo === 0) {
                this.relogio.destroy()
                this.scene.stop('claimCredits')
                this.scene.start('mainMenu')
              }
            },
            callbackScope: this,
            loop: true
          })
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          this.enviar.text = '[401]'
          this.tempo = 2
          this.relogio = this.time.addEvent({
            delay: 1000,
            callback: () => {
              this.tempo--
              if (this.tempo === 0) {
                this.relogio.destroy()
                this.enviar.destroy()
              }
            },
            callbackScope: this,
            loop: true
          })
        }
        console.error(error)
      })
  }

  update (time, delta) { }
}
