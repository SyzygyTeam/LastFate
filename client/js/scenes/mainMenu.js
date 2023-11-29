import * as settings from '../settingsMenu.js'

/* global Phaser */
export default class mainMenu extends Phaser.Scene {
  constructor () {
    super('mainMenu')
  }

  preload () {
    /* Images */
    this.load.image('sky', '../../assets/mainMenu/sky.png')
    this.load.image('cloud', '../../assets/mainMenu/cloud.png')
    this.load.image('mountains', '../../assets/mainMenu/mountains.png')
    this.load.image('door', '../../assets/mainMenu/door.png')
    this.load.image('fog', '../../assets/mainMenu/fog.png')
    this.load.image('filter', '../../assets/mainMenu/filter.png')
    this.load.image('gameLogo', '../../assets/mainMenu/gameLogo.png')

    /* Buttons */
    this.load.image('playButton', '../../assets/mainMenu/playButton.png')
    this.load.image('creditsButton', '../../assets/mainMenu/creditsButton.png')

    /* SoundTrack */
    this.load.audio('mainST', '../../assets/mainMenu/mainST.mp3')

    settings.preloadElements(this)
  }

  create () {
    this.mainST = this.sound.add('mainST')
    this.mainST.loop = true
    this.mainST.play()
    this.mainST.setVolume(0.5)

    this.sky = this.add.sprite(400, 225, 'sky')
    this.cloud = this.add.sprite(900, 50, 'cloud')
      .setAlpha(0.5)
    this.mountains = this.add.sprite(400, 225, 'mountains')
    this.door = this.add.sprite(400, 225, 'door')
    this.fog = this.add.sprite(400, 420, 'fog')
      .setAlpha(0.5)
    this.filter = this.add.sprite(400, 225, 'filter')

    this.skyMoviment = this.tweens.addCounter({
      from: 225,
      to: 215,
      duration: 4500,
      yoyo: true,
      loop: -1,
      onUpdate: (tween) => {
        const y = tween.getValue()
        this.sky.setPosition(400, y)
      }
    })

    this.cloudMoviment = this.tweens.addCounter({
      from: 900,
      to: -300,
      duration: 100000,
      yoyo: false,
      loop: -1,
      onUpdate: (tween) => {
        const x = tween.getValue()
        this.cloud.setPosition(x, 50)
      }
    })

    this.playButton = this.add.sprite(50, 300, 'playButton')
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerdown', () => {
        this.cameras.main.fadeOut(400, 0, 0, 0)
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.playButton.disableInteractive()
          this.scene.start('roomLobby')
        })
      })

    this.creditsButton = this.add.sprite(50, 350, 'creditsButton')
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerdown', () => {

      })

    this.gameLogo = this.add.sprite(120, 110, 'gameLogo')

    settings.displaySettings(this)
    this.cameras.main.fadeIn(1000)
  }

  update (time, delta) { }
}
