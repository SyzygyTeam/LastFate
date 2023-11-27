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
    this.load.image('forest', '../../assets/battleBg/forest.png')
    this.load.image('whiteVignette', '../../assets/battleBg/whiteVignette.png')
    this.load.spritesheet('spark', '../../assets/battleBg/spark.png', { frameWidth: 32, frameHeight: 32 })

    this.load.image('cardBg', '../../assets/cardsBg/white.png')
    this.load.image('testSprite', '../../assets/cardsSprites/testSprite.png')

    settings.preloadElements(this)
  }

  create () {
    this.game.socket.on('start-match', (npcChoice) => {
      this.npcChoice = npcChoice
    })

    /* Avisar server */
    if (this.game.player === 'p1') {
      this.game.socket.emit('players-ready', this.game.roomNo)
    }

    /* VOIP P2 */
    if (this.game.player === 'p2') {
      this.runVoip()
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
    this.whiteVignette = this.add.sprite(400, 225, 'whiteVignette')
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

    this.whiteVignetteFX = this.tweens.addCounter({
      from: 0.1,
      to: 1,
      duration: 1000,
      yoyo: true,
      loop: -1,
      onUpdate: (tween) => {
        const alpha = tween.getValue()
        this.whiteVignette.setAlpha(alpha)
      }
    })

    /* Tela de seleção de turno */
    this.darkBG = this.add.rectangle(400, 225, 800, 450, 0x000000)
      .setAlpha(0.5)

    this.titleText = this.add.text(400, 100, 'Selecionem seus turnos')
      .setOrigin(0.5)

    this.game.socket.on('summon-unit', (card) => {
      console.log(card)
      this.add.sprite(card.x, card.y, card.sprite)
    })

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY - 70
      if (gameObject.y < 300) {
        this.whiteVignette.setVisible(true)
        gameObject.bgEffect.setVisible(true)
      } else {
        this.whiteVignette.setVisible(false)
        gameObject.bgEffect.setVisible(false)
      }
    })

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

  startMatch () {
    this.game.socket.emit('start-match', this.game.roomNo)
    /* Criação dos Cards */
    this.card1 = new Card(this, 400, 440, cardList.giganteLorde)
    this.card2 = new Card(this, 400 * 1.5, 440, cardList.pequenoMago)
    this.card3 = new Card(this, 400 / 2, 440, cardList.bonecoDeTeste)
  }

  playCard (cardInfo, card) {
    this.game.socket.emit('play-card', this.game.roomNo, cardInfo)
    card.setVisible(false)
  }

  update (time, delta) {
  }
}
