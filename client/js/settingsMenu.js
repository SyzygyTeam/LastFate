export { preloadElements, displaySettings }

/* Responsável pelos menus de configurações p/ o usuário */
/* Serve para ser acessado em todas as cenas (import) */

/* Somente p/ o preload */
function preloadElements (scene) {
  scene.load.image('gear', '../assets/settings/gear.png')
  scene.load.image('close', '../assets/settings/closeIcon.png')
  scene.load.image('settingsBg', '../assets/settings/bg.png')
}

/* Exibição e interatividade do menu */
function displaySettings (scene) {
  const darkerBg = scene.add.rectangle(400, 225, 800, 450, 0x050505, 50)
    .setVisible(false)

  const settingsBg = scene.add.sprite(400, 225, 'settingsBg')
    .setVisible(false)
    .setInteractive()
    .on('pointerdown', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    })

  const closeSettings = scene.add.sprite(535, 85, 'close')
    .setVisible(false)
    .setInteractive()
    .on('pointerdown', () => {
      gear.setVisible(true)
      settingsElements.forEach(i => {
        i.setVisible(false)
        i.disableInteractive()
      })
    })

  // TODO: Proceguir os menus
  // const fullscreenTxt =
  // const fullscreenCheck =

  const settingsElements = [darkerBg, settingsBg, closeSettings]

  const gear = scene.add.sprite(760, 40, 'gear')
    .setScale(2)
    .setInteractive()
    .on('pointerdown', () => {
      gear.setVisible(false)
      settingsElements.forEach(i => {
        i.setVisible(true)
        i.setInteractive()
      })
    })
}
