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

    this.load.image('door', '../../assets/mainMenu/door.png')

    settings.preloadElements(this)
  }

  create () {
    /* Formatações de texto */
    this.keyboardFormat = {
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
    }

    this.titleFormat = {
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
    }

    this.add.rectangle(400, 225, 800, 450, 0x222034, 50)
    this.add.sprite(400, 225, 'door')

    this.backSound = this.sound.add('back')
    this.keySound = this.sound.add('key')
    this.confirmSound = this.sound.add('confirm')

    this.add.text(400, 50, 'Resgate seus Tijolinhos', this.titleFormat)
      .setOrigin(0.5, 0.5)

    this.posicao = ''

    this.usuarioTextoBase = 'Usuário: '
    this.usuarioDigitado = ''
    this.usuario = this.add.text(300, 100, this.usuarioTextoBase, this.keyboardFormat)
      .setTint(0xd0d0d0)
      .setInteractive()
      .on('pointerdown', () => {
        this.posicao = 'usuário'
        this.usuario.clearTint()
        this.senha.setTint(0xaaaaaa)
        this.voltar.x = 750
        this.voltar.y = this.usuario.y
      })

    this.senhaTextoBase = 'Senha: '
    this.senhaDigitada = ''
    this.senha = this.add.text(300, 200, this.senhaTextoBase, this.keyboardFormat)
      .setTint(0xd0d0d0)
      .setInteractive()
      .on('pointerdown', () => {
        this.posicao = 'senha'
        this.usuario.setTint(0xaaaaaa)
        this.senha.clearTint()
        this.voltar.x = 750
        this.voltar.y = this.senha.y
      })

    const teclado = [...Array(10).keys()]
    teclado.forEach(digito => {
      const valor = (digito + 1) % 10
      this.add.text(80 * ((digito % 3) + 1), 80 * (Math.floor(digito / 3) + 1), valor, this.keyboardFormat)
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
            this.enviar = this.add.text(450, 300, '[ENVIAR]', this.keyboardFormat)
              .setInteractive()
              .on('pointerdown', () => {
                this.confirmSound.play()
                this.serverInteraction()
              })
          }
        })
    })

    this.voltar = this.add.text(800, 100, '<', this.keyboardFormat)
      .setTint(0xff00000)
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
