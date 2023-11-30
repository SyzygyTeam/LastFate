import * as settings from '../settingsMenu.js'
import * as cardList from '../cardList.js'
import Card from '../Card.js'

/* Cena p/ as partidas do Game */

/* global Phaser */
export default class battleMatch extends Phaser.Scene {
  constructor () {
    super('battleMatch')
  }

  preload () {
    this.spritePaths = ['aFenix',
      'ameacaVulcanica',
      'anaoRobusto',
      'anomaliaEspinhosa',
      'arautoAnciao',
      'arqueiroAeromante',
      'arqueiroNovico',
      'aSentença',
      'barbaroErudito',
      'basiliscoSombrio',
      'bestaInfernal',
      'cavaleiroErudito',
      'cavaleiroRedimido',
      'chamaViva',
      'ciclope',
      'colossoDeGelo',
      'damaAudaciosa',
      'dragaoAureo',
      'dragaoNovico',
      'dragaoPenumbra',
      'dragaoTurquesa',
      'elementalDeBarro',
      'elfaProdigio',
      'fadaGotaDagua',
      'fagulha',
      'feiticeiraAprendiz',
      'felinoChicote',
      'giganteLorde',
      'golemDeMagma',
      'grifoRastreador',
      'guardiaoArvore',
      'homemMorcego',
      'ignicornio',
      'komainu',
      'licantropoOculto',
      'minotauroCarmesim',
      'observador',
      'oExecutor',
      'ogroAcogueiro',
      'ogroMacico',
      'pequenoBrotinho',
      'puxaCovas',
      'símioDasNeves',
      'tribalRastreador',
      'trollLiberto']

    for (let i = 0; i < this.spritePaths.length; i++) {
      this.load.image(this.spritePaths[i], `../../assets/cardsSprites/${this.spritePaths[i]}.png`)
    }

    this.load.image('vignette', '../../assets/vignette.png')
    this.load.image('forest', '../../assets/battleMatch/forest.png')
    this.load.image('atk', '../../assets/battleMatch/atk.png')
    this.load.image('def', '../../assets/battleMatch/def.png')
    this.load.image('frame', '../../assets/battleMatch/frame.png')
    this.load.image('undo', '../../assets/battleMatch/undo.png')
    this.load.spritesheet('spark', '../../assets/battleMatch/spark.png', { frameWidth: 32, frameHeight: 32 })

    this.load.image('cardBg', '../../assets/cardsBg/white.png')
    this.load.image('giganteLorde', '../../assets/cardsSprites/giganteLorde.png')

    settings.preloadElements(this)
  }

  create () {
    /* Formatações de Texto */
    this.hugeTextFormat = {
      fontFamily: 'PressStart2P',
      fontSize: '30px',
      resolution: 0.7,
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
      resolution: 0.7,
      fill: '#f9f9f9',
      stroke: '#050505',
      strokeThickness: 2,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        fill: true
      }
    }

    /* VOIP P2 */
    if (this.game.player === 'p2') {
      this.runVoip()
      this.game.socket.emit('players-ready', this.game.roomNo)
    }

    this.game.socket.on('offer', (description) => {
      this.game.remoteConnection = new RTCPeerConnection(this.ice_servers)

      this.game.midias
        .getTracks()
        .forEach((track) =>
          this.game.remoteConnection.addTrack(track, this.game.midias)
        )

      this.game.remoteConnection.onicecandidate = ({ candidate }) => {
        candidate &&
          this.game.socket.emit('candidate', this.game.roomNo, candidate)
      }

      this.game.remoteConnection.ontrack = ({ streams: [stream] }) => {
        this.game.audio.srcObject = stream
      }

      this.game.remoteConnection
        .setRemoteDescription(description)
        .then(() => this.game.remoteConnection.createAnswer())
        .then((answer) =>
          this.game.remoteConnection.setLocalDescription(answer)
        )
        .then(() => {
          this.game.socket.emit(
            'answer',
            this.game.roomNo,
            this.game.remoteConnection.localDescription
          )
        })
    })

    this.game.socket.on('answer', (description) => {
      this.game.localConnection.setRemoteDescription(description)
    })

    this.game.socket.on('candidate', (candidate) => {
      const conn = this.game.localConnection || this.game.remoteConnection
      conn.addIceCandidate(new RTCIceCandidate(candidate))
    })

    /* Adição dos Sprites */
    this.add.sprite(400, 225, 'forest')
    this.vignette = this.add.sprite(400, 225, 'vignette')
      .setVisible(false)
    this.anims.create({
      key: 'sparkAnim',
      frames: this.anims.generateFrameNumbers('spark', { start: 0, end: 11 }),
      frameRate: 20,
      repeat: -1
    })
    /*
    this.spark = this.add.sprite(400, 225, 'spark')
      .play('sparkAnim')
    */

    /* Efeitos de Vignette */
    this.vignetteFX = this.tweens.addCounter({
      from: 0.1,
      to: 1,
      duration: 1000,
      yoyo: true,
      loop: -1,
      onUpdate: (tween) => {
        const alpha = tween.getValue()
        this.vignette.setAlpha(alpha)
      }
    })

    this.startChoices()
    settings.displaySettings(this)
  }

  runVoip () {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        console.log(stream)

        this.game.localConnection = new RTCPeerConnection(
          this.game.ice_servers
        )

        stream
          .getTracks()
          .forEach((track) =>
            this.game.localConnection.addTrack(track, stream)
          )

        this.game.localConnection.onicecandidate = ({ candidate }) => {
          candidate &&
            this.game.socket.emit('candidate', this.game.roomNo, candidate)
        }

        this.game.localConnection.ontrack = ({ streams: [stream] }) => {
          this.game.audio.srcObject = stream
        }

        this.game.localConnection
          .createOffer()
          .then((offer) =>
            this.game.localConnection.setLocalDescription(offer)
          )
          .then(() => {
            this.game.socket.emit(
              'offer',
              this.game.roomNo,
              this.game.localConnection.localDescription
            )
          })

        this.game.midias = stream
      })
      .catch((error) => console.log(error))
  }

  startChoices () {
    /* Tela de seleção de turnos */
    this.darkBG = this.add.rectangle(400, 225, 800, 450, 0x000000)
      .setAlpha(0.5)

    /* Título da seleção de turnos */
    this.titleText = this.add.text(400, 70, 'Selecionem seus turnos', this.hugeTextFormat)
      .setOrigin(0.5)

    /* Ícones interativos */
    this.turnChoiceSprites = Array(3)
    this.turnNumberText = Array(3)
    this.atkChoiceSprites = Array(2)
    this.defChoiceSprites = Array(2)

    for (let i = 0; i < 3; i++) {
      this.turnChoiceSprites[i] = this.add.sprite(200 * i + 200, 225, 'frame')
        .setScale(2)
        .setInteractive()
        .on('pointerdown', () => {
          this.game.socket.emit('occupy-turn', this.game.roomNo, i + 1)
        })

      this.turnNumberText[i] = this.add.text(200 * i + 200, 225, i + 1, this.hugeTextFormat)
        .setOrigin(0.5)

      this.atkChoiceSprites[i] = this.add.sprite(200 * i + 200, 150, 'atk')
        .setScale(2)
        .setInteractive()
        .on('pointerdown', () => {
          this.turn = { no: i + 1, isAttacker: true }
          this.game.socket.emit('occupy-turn', this.game.roomNo, this.game.player, this.turn)
        })
      this.defChoiceSprites[i] = this.add.sprite(200 * i + 200, 300, 'def')
        .setScale(2)
        .setInteractive()
        .on('pointerdown', () => {
          this.turn = { no: i + 1, isAttacker: false }
          this.game.socket.emit('occupy-turn', this.game.roomNo, this.game.player, this.turn)
        })
    }

    /* NPC ocupa um turno */
    this.game.socket.on('npc-choice', (choice) => {
      this.atkChoiceSprites[choice].setVisible(false)
      this.defChoiceSprites[choice].setVisible(false)
      this.turnChoiceSprites[choice].setTint(0x9a0505)
      this.turnNumberText[choice].setTint(0xddddaa)
    })

    /* Atualiza os ícones */
    this.game.socket.on('notify-turn', (turn) => {
      const players = [turn.p1, turn.p2]
      const colors = [0x9a0505, 0x05059a]
      const playerString = ['p1', 'p2']

      for (let i = 0; i < 3; i++) {
        this.atkChoiceSprites[i].clearTint().setInteractive()
        this.defChoiceSprites[i].clearTint().setInteractive()
      }

      if (players[0].turn.no !== 0 && players[1].turn.no !== 0) {
        this.confirmButton.clearTint().setInteractive()
      } else {
        this.confirmButton.setTint(0x9a9a9a).disableInteractive()
      }

      for (let i = 0; i < 2; i++) {
        if (players[i].turn.no !== 0) {
          if (players[i].turn.isAttacker) {
            for (let j = 0; j < 3; j++) {
              this.atkChoiceSprites[j].disableInteractive().setTint(0x9a9a9a)
            }
            this.atkChoiceSprites[players[i].turn.no - 1].disableInteractive().setTint(colors[i])
            this.defChoiceSprites[players[i].turn.no - 1].disableInteractive().setTint(0x9a9a9a)
            if (playerString[i] === this.game.player) {
              this.undoButton.clearTint().setInteractive()
            }
          } else {
            for (let j = 0; j < 3; j++) {
              this.defChoiceSprites[j].disableInteractive().setTint(0x9a9a9a)
            }
            this.defChoiceSprites[players[i].turn.no - 1].disableInteractive().setTint(colors[i])
            this.atkChoiceSprites[players[i].turn.no - 1].disableInteractive().setTint(0x9a9a9a)
            if (playerString[i] === this.game.player) {
              this.undoButton.clearTint().setInteractive()
            }
          }
        }
      }
    })

    this.game.socket.on('notify-state', (state) => {
      this.undoButton.setVisible(false)
    })

    this.confirmButton = this.add.text(400, 380, 'OK', this.thinTextFormat)
      .setTint(0x9a9a9a)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.confirmButton.clearTint().setTint(0x05f905).disableInteractive()
        this.game.socket.emit('publish-state', this.game.roomNo, this.game.player)
      })

    this.undoButton = this.add.sprite(400, 420, 'undo')
      .setTint(0x9a9a9a)
      .on('pointerdown', () => {
        this.game.socket.emit('undo-turn', this.game.roomNo, this.game.player)
        this.undoButton.setTint(0x9a9a9a).disableInteractive()
      })
    this.game.socket.on('start-match', () => { this.startMatch() })
  }

  startMatch () {
    this.darkBG.setVisible(false)
    this.titleText.setVisible(false)

    for (let i = 0; i < 3; i++) {
      this.turnChoiceSprites[i].setVisible(false)
      this.turnNumberText[i].setVisible(false)
      this.atkChoiceSprites[i].setVisible(false)
      this.defChoiceSprites[i].setVisible(false)
    }

    this.board = []

    this.game.socket.on('summon-unit', (card) => {
      const sprite = this.add.sprite(card.x, card.y, card.sprite)
      this.equalizeScale(sprite)
      this.board.push(sprite)
    })

    /* Arrastar carta */
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY - 70
      if (gameObject.y < 300 && this.turn === this.game.player) {
        this.vignette.setVisible(true)
        gameObject.bgEffect.setVisible(true)
      } else {
        this.vignette.setVisible(false)
        gameObject.bgEffect.setVisible(false)
      }
    })

    this.game.socket.emit('start-turn', this.game.roomNo)

    /* Criação dos Cards */
    this.card1 = new Card(this, 400, 440, cardList.giganteLorde)
    this.card2 = new Card(this, 400 * 1.5, 440, cardList.guardiaoArvore)
    this.card3 = new Card(this, 400 / 2, 440, cardList.komainu)
  }

  playCard (cardInfo, card) {
    if (this.turn === this.game.player) {
      this.game.socket.emit('play-card', this.game.roomNo, cardInfo)
      card.setVisible(false)
    } else {
      const text = this.add.text(400, 225, 'Não é sua vez', this.hugeTextFormat)
        .setOrigin(0.5)
      this.time.delayedCall(2000, () => {
        text.destroy()
      })
    }
  }

  equalizeScale (spriteImg) {
    const imageSize = spriteImg.width * spriteImg.height
    const targetSize = 128 * 128

    const scale = Math.sqrt(targetSize / imageSize)
    spriteImg.setScale(scale)
  }

  update (time, delta) { }
}
