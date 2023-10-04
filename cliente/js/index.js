import config from './config.js'
import mainMenu from './scenes/mainMenu.js'
import battleMatch from './scenes/battleMatch.js'

/* global Phaser */
class Game extends Phaser.Game {
  constructor () {
    super(config)

    this.socket = io() /* global io */
    this.socket.on('connect', () => {
      console.log('Connected to server!')
      this.socket.emit('enter-room', 1)

      this.socket.on('players', (players) => {
        console.log(players)
      })
    })

    this.scene.add('mainMenu', mainMenu)
    this.scene.add('battleMatch', battleMatch)

    this.scene.start('mainMenu')
  }
}

window.onload = () => {
  window.game = new Game()
}
