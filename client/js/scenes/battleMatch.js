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
      'aSentenca',
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
      'simioDasNeves',
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
    this.load.image('p1', '../../assets/battleMatch/p1.png')
    this.load.image('p2', '../../assets/battleMatch/p2.png')
    this.load.image('buttonP1', '../../assets/battleMatch/buttonP1.png')
    this.load.image('buttonP2', '../../assets/battleMatch/buttonP2.png')
    this.load.spritesheet('spark', '../../assets/battleMatch/spark.png', { frameWidth: 32, frameHeight: 32 })

    this.load.image('cardBg', '../../assets/cardsBg/white.png')
    this.load.image('giganteLorde', '../../assets/cardsSprites/giganteLorde.png')

    this.load.audio('battleStartST', '../../assets/battleMatch/battleStartST.mp3')
    this.load.audio('battleST', '../../assets/battleMatch/battleST.mp3')
    this.load.audio('winST', '../../assets/battleMatch/winST.mp3')
    this.load.audio('defeatST', '../../assets/battleMatch/defeatST.mp3')

    settings.preloadElements(this)
  }

  create () {
    /* Músicas */
    this.sound.stopByKey('mainST')
    this.battleST = this.sound.add('battleST')
    this.battleST.loop = true
    this.battleStartST = this.sound.add('battleStartST')
      .on('complete', () => { this.battleST.play() })
    this.winST = this.sound.add('winST')
    this.defeatST = this.sound.add('defeatST')

    this.winST.loop = true
    this.defeatST.loop = true

    this.battleStartST.play()

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

    this.buttonTextFormat = {
      fontFamily: 'VT323',
      fontSize: '20px',
      resolution: 0.7,
      fill: '#f9f9f9'
    }

    if (this.game.player === 'p1') {
      this.myDeck = [
        cardList.ameacaVulcanica,
        cardList.arqueiroAeromante,
        cardList.chamaViva,
        cardList.aSentenca,
        cardList.dragaoNovico,
        cardList.fagulha,
        cardList.grifoRastreador,
        cardList.golemDeMagma,
        cardList.puxaCovas,
        cardList.cavaleiroErudito
      ]
    } else {
      this.myDeck = [
        cardList.arautoAnciao,
        cardList.tribalRastreador,
        cardList.pequenoBrotinho,
        cardList.observador,
        cardList.grifoRastreador,
        cardList.elfaProdigio,
        cardList.cavaleiroRedimido,
        cardList.colossoDeGelo,
        cardList.damaAudaciosa,
        cardList.dragaoAureo
      ]
    }

    const x = [
      cardList.anaoRobusto,
      cardList.barbaroErudito,
      cardList.cavaleiroErudito,
      cardList.ciclope,
      cardList.ignicornio,
      cardList.komainu,
      cardList.ogroAcogueiro,
      cardList.ogroMacico,
      cardList.simioDasNeves,
      cardList.trollLiberto
    ]

    /* VOIP P2 */
    if (this.game.player === 'p2') {
      this.runVoip()
      this.game.socket.emit('players-ready', this.game.roomNo, x)
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

    this.p1Sprite = this.add.sprite(70, 370, 'p1')
    this.p2Sprite = this.add.sprite(730, 370, 'p2')

    this.p1Txt = this.add.text(235, 370, 'Jogador 1', this.thinTextFormat).setOrigin(0.5)
    this.p2Txt = this.add.text(565, 370, 'Jogador 2', this.thinTextFormat).setOrigin(0.5)

    const blueTxtStr = this.game.player === 'p1' ? 'Você' : 'Sua dupla'
    const redTxtStr = this.game.player === 'p1' ? 'Sua dupla' : 'Você'

    this.blueTxt = this.add.text(235, 410, blueTxtStr, this.thinTextFormat).setOrigin(0.5)
    this.redTxt = this.add.text(565, 410, redTxtStr, this.thinTextFormat).setOrigin(0.5)

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

      this.turnNumberText[i] = this.add.text(200 * i + 200, 225, i + 1, this.hugeTextFormat)
        .setOrigin(0.5)

      this.atkChoiceSprites[i] = this.add.sprite(200 * i + 200, 150, 'atk')
        .setScale(2)
        .setInteractive()
        .on('pointerdown', () => {
          const turn = { no: i + 1, isAttacker: true }
          this.game.socket.emit('occupy-turn', this.game.roomNo, this.game.player, turn)
        })
      this.defChoiceSprites[i] = this.add.sprite(200 * i + 200, 300, 'def')
        .setScale(2)
        .setInteractive()
        .on('pointerdown', () => {
          const turn = { no: i + 1, isAttacker: false }
          this.game.socket.emit('occupy-turn', this.game.roomNo, this.game.player, turn)
        })
    }

    /* NPC ocupa um turno */
    this.game.socket.on('npc-choice', (choice) => {
      this.atkChoiceSprites[choice].setVisible(false)
      this.defChoiceSprites[choice].setVisible(false)
      this.turnChoiceSprites[choice].setTint(0x9a9a9a)
      this.turnNumberText[choice].setTint(0xddddaa)
    })

    /* Atualiza os ícones */
    this.game.socket.on('notify-turn', (turn) => {
      const players = [turn.p1, turn.p2]
      const colors = [0x05059a, 0x9a0505]
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
              this.myRole = players[i].turn.isAttacker ? 'atk' : 'def'
            }
          } else {
            for (let j = 0; j < 3; j++) {
              this.defChoiceSprites[j].disableInteractive().setTint(0x9a9a9a)
            }
            this.defChoiceSprites[players[i].turn.no - 1].disableInteractive().setTint(colors[i])
            this.atkChoiceSprites[players[i].turn.no - 1].disableInteractive().setTint(0x9a9a9a)
            if (playerString[i] === this.game.player) {
              this.undoButton.clearTint().setInteractive()
              this.myRole = players[i].turn.isAttacker ? 'atk' : 'def'
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

    this.game.socket.on('start-match', (firstTurn, p1Role) => {
      this.confirmButton.setVisible(false)
      this.turn = firstTurn
      this.startMatch()
    })
  }

  startMatch () {
    this.hand = []
    this.board = []
    this.enemyBoard = []
    this.alreadyAttacked = false
    this.isBeingAttacked = false

    this.outHP = 20
    this.oppHP = 20

    this.darkBG.setVisible(false)
    this.titleText.setVisible(false)

    this.p1Txt.setVisible(false)
    this.p2Txt.setVisible(false)

    this.blueTxt.setVisible(false)
    this.redTxt.setVisible(false)

    if (this.game.player === 'p1') {
      this.button = this.add.sprite(720, 225, 'buttonP1')
        .setInteractive()
    } else {
      this.button = this.add.sprite(720, 225, 'buttonP2')
        .setInteractive()
    }

    this.buttonText = this.add.text(720, 225, '', this.buttonTextFormat)

    for (let i = 0; i < 3; i++) {
      this.turnChoiceSprites[i].setVisible(false)
      this.turnNumberText[i].setVisible(false)
      this.atkChoiceSprites[i].setVisible(false)
      this.defChoiceSprites[i].setVisible(false)
    }

    this.game.socket.on('next-turn', (turn) => {
      this.turn = turn
      this.seeForActions()
    })

    this.game.socket.on('summon-ally-troup', (card) => {
      const sideFactor = this.board.length % 2 === 0 ? -1 : 1
      const spriteX = (Math.ceil(this.board.length / 2) * sideFactor * 130) + 400

      const sprite = this.add.sprite(spriteX, 300, card.sprite)
        .on('pointerdown', () => {
          let clicked
          if (clicked) {
            sprite.setScale(1).clearTint()
            clicked = false
          } else { sprite.setTint(0x9a0505) }
        })
      this.equalizeScale(sprite)
      this.board.push(sprite)
      this.children.bringToTop(this.p1Sprite)
      this.children.bringToTop(this.p2Sprite)
      this.children.bringToTop(this.button)
      this.children.bringToTop(this.buttonText)
      for (let i = 0; i < this.hand.length; i++) {
        this.children.bringToTop(this.hand[i])
      }
      this.seeForActions()
    })

    this.game.socket.on('npc-play', (card) => {
      const sideFactor = this.enemyBoard.length % 2 === 0 ? -1 : 1
      const spriteX = (Math.ceil(this.enemyBoard.length / 2) * sideFactor * 130) + 400

      const sprite = this.add.sprite(spriteX, 70, card.path)
      this.equalizeScale(sprite)
      this.enemyBoard.push(sprite)
      this.children.bringToTop(this.p1Sprite)
      this.children.bringToTop(this.p2Sprite)
      this.children.bringToTop(this.button)
      this.children.bringToTop(this.buttonText)
      for (let i = 0; i < this.hand.length; i++) {
        this.children.bringToTop(this.hand[i])
      }
    })

    this.game.socket.on('npc-attack', (card) => {
      this.isBeingAttacked = true
      this.seeForActions()
    })

    this.game.socket.on('win', () => {
      this.win()
    })

    this.game.socket.on('defeat', () => {
      this.defeat()
    })

    /* Arrastar carta */
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      this.children.bringToTop(gameObject)
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

    /* Criação dos Cards */
    for (let i = 0; i < 4; i++) {
      this.drawCard()
    }

    this.seeForActions()
  }

  seeForActions () {
    if (this.isBeingAttacked) {
      this.buttonText.setText('Defender').setOrigin(0.5)
    } else if (this.turn !== this.game.player) {
      this.buttonText.setText('Aguar-\ndando').setOrigin(0.5)
      this.button.setTint(0x9a9a9a).disableInteractive()
    } else {
      this.button.clearTint().setInteractive()
      if (this.myRole === 'atk' && !this.alreadyAttacked && this.board.length > 0) {
        this.buttonText.setText('Atacar').setOrigin(0.5)
        this.button.on('pointerdown', () => {
          this.alreadyAttacked = true
          this.button.clearTint().setInteractive()
          this.buttonText.setText('Confirmar').setOrigin(0.5)
          this.game.socket.emit('end-turn', this.game.roomNo, this.game.player)
          this.button.on('pointerdown', () => {
            this.seeForActions()
          })
          for (let i = 0; i < this.board.length; i++) {
            this.board[i].setInteractive()
          }
        })
      } else {
        this.buttonText.setText('Passar').setOrigin(0.5)
        this.button.on('pointerdown', () => {
          this.game.socket.emit('end-turn', this.game.roomNo, this.game.player)
          this.button.clearTint().setInteractive()
          this.buttonText.setText('Aguarde').setOrigin(0.5)
          this.alreadyAttacked = false
          this.game.socket.emit('pass-turn', this.game.roomNo)
        })
      }
    }
  }

  playCard (cardInfo, card) {
    if (this.board.length > 6) {
      const fullBoardText = this.add.text(400, 225, 'Limite de cartas no campo atingido', this.hugeTextFormat)
        .setOrigin(0.5)
      this.time.delayedCall(2000, () => {
        fullBoardText.destroy()
      })
    } else if (this.turn === this.game.player) {
      this.game.socket.emit('play-card', this.game.roomNo, cardInfo)
      card.setVisible(false)
    } else if (this.isBeingAttacked) {
      const text = this.add.text(400, 225, 'Não durante um ataque', this.hugeTextFormat)
        .setOrigin(0.5)
      this.time.delayedCall(2000, () => {
        text.destroy()
      })
    } else {
      const text = this.add.text(400, 225, 'Não é sua vez', this.hugeTextFormat)
        .setOrigin(0.5)
      this.time.delayedCall(2000, () => {
        text.destroy()
      })
    }
  }

  drawCard () {
    if (this.hand.length > 5) { return }
    const rng = Math.floor(Math.random() * this.myDeck.length)
    const sideFactor = this.hand.length % 2 === 0 ? -1 : 1
    const cardX = (Math.ceil(this.hand.length / 2) * sideFactor * 130) + 400
    this.hand.push(new Card(this, cardX, 440, this.myDeck[rng]))
  }

  equalizeScale (spriteImg) {
    const imageSize = spriteImg.width * spriteImg.height
    const targetSize = 128 * 128

    const scale = Math.sqrt(targetSize / imageSize)
    spriteImg.setScale(scale)
  }

  defeat () {
    this.sound.stopByKey('battleST')
    this.defeatST.play()

    this.darkBG.setVisible(true)
    this.add.text(400, 225, 'Derrota', this.hugeTextFormat)
      .setOrigin(0.5)
      .setTint(0x9a0505)
    this.add.text(400, 300, '- Voltar ao Menu -', this.hugeTextFormat)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('mainMenu')
      })
  }

  win () {
    this.sound.stopByKey('battleST')
    this.winST.play()

    this.darkBG.setVisible(true)
    this.add.text(400, 225, 'Vitória!', this.hugeTextFormat)
      .setOrigin(0.5)
      .setTint(0x9a0505)
    this.add.text(400, 300, '- Continuar -', this.hugeTextFormat)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('mainMenu')
      })
  }

  update (time, delta) { }
}
