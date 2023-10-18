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
    this.load.image('cardBg', '../../assets/cardsBg/white.png')
    this.load.image('testSprite', '../../assets/cardsSprites/testSprite.png')

    settings.preloadSettings(this)
  }

  create () {
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

      const midias = this.game.midias
      this.game.remoteConnection.ontrack = ({ streams: [midias] }) => {
        this.game.audio.srcObject = this.game.midias
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

    this.add.sprite(400, 225, 'forest')
      .setInteractive()
      .on('pointerdown', () => {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen()
        } else {
          this.scale.startFullscreen()
        }
      })

    /* Criação dos Cards */
    this.card1 = new Card(this, 400, 440, cardList.giganteLorde)
    this.card2 = new Card(this, 400 * 1.5, 440, cardList.pequenoMago)
    this.card3 = new Card(this, 400 / 2, 440, cardList.bonecoDeTeste)

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY - 70
      if (gameObject.y < 300) {
        gameObject.bgEffect.setVisible(true)
      } else {
        gameObject.bgEffect.setVisible(false)
      }
    })

    settings.displaySettings(this)
  }

  update (time, delta) {
  }
}
