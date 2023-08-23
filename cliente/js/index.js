import config from './config.js'
import cena0 from './cena0.js'

class Game extends Phaser.Game {
  constructor () {
    super(config)
    this.scene.add('cena_0', cena0)
    this.scene.start('cena_0')
  }
}

window.onload = () => {
  window.game = new Game()
}
