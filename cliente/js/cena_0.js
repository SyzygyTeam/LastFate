export default class cena_0 extends Phaser.Scene {
	constructor () {
		super('cena_0')
	}

	preload() {
		this.load.image('ifsc-sj-2014', '../assets/ifsc-sj-2014.png')
	}

	create() {
		this.add.image(640, 360, 'ifsc-sj-2014')
	}

	update() { }
}