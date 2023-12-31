const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 3000

const roomsData = new Map()

/* Ao tentar conectar ao server */
io.on('connection', (socket) => {
  console.log(`User ${socket.id} has connected.`)

  /* Ao tentar desconectar */
  socket.on('disconnecting', (reason) => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        /* Atualiza a qntdd de player na Sala */
        socket.to(room).emit('room-status-reply', 1)
      }
    }
  })

  /* Ao desconectar */
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} has disconnected.`)
  })

  /* VOIP */
  socket.on('offer', (room, description) => {
    socket.to(room).emit('offer', description)
  })

  socket.on('candidate', (room, candidate) => {
    socket.to(room).emit('candidate', candidate)
  })

  socket.on('answer', (room, description) => {
    socket.to(room).emit('answer', description)
  })

  /* Ao tentar criar uma sala aleatória */
  socket.on('create-room', () => {
    const room = rngRoom() // Gera um código de sala aleatório
    socket.join(room) // Entra no código gerado
    console.log(`User ${socket.id} has created the room ${room}.`)

    const players = {
      p1: {
        id: socket.id,
        turn: { no: 0, isAttacker: false }
      },
      p2: undefined
    }

    const npc = {
      turn: 0,
      deck: [],
      name: 'NPC',
      health: 20
    }

    const enemyField = []

    const matchTurns = [0, 0, 0]

    const matchIndex = 0

    const ready = [false, false]

    const roomData = {
      players,
      npc,
      enemyField,
      matchIndex,
      matchTurns,
      ready
    }

    roomsData.set(room, roomData)

    io.to(socket.id).emit('enter-room-ok', { no: room })
    io.to(room).emit('players', players)
  })

  /* Ao tentar entrar numa sala existente */
  socket.on('enter-room', (room) => {
    /* Checa a existência da sala e se está cheia */
    if (!io.sockets.adapter.rooms.has(room)) {
      io.to(socket.id).emit('enter-room-404', { no: room })
    } else if (io.sockets.adapter.rooms.get(room).size === 2) {
      io.to(socket.id).emit('enter-room-full', { no: room })
    } else {
      socket.join(room)
      console.log(`User ${socket.id} has entered the room ${room}.`)

      const players = roomsData.get(room).players
      players.p2 = {
        id: socket.id,
        turn: { no: 0, isAttacker: false }
      }

      roomsData.get(room).players = players

      console.log(`Room ${room} filled. Match starting!`)
      io.to(socket.id).emit('enter-room-ok', { no: room })
      io.to(room).emit('players', players)
    }
  })

  /* Ao tentar obter status da qntdd de players na sala */
  socket.on('room-status-request', (room) => {
    const playerStatus = io.sockets.adapter.rooms.get(room).size
    io.to(room).emit('room-status-reply', playerStatus)
  })

  socket.on('publish-state', (room, player) => {
    const roomData = roomsData.get(room)
    if (player === 'p1') { roomsData.get(room).ready[0] = true }
    if (player === 'p2') { roomsData.get(room).ready[1] = true }

    io.to(room).emit('notify-state', roomData.ready)
    if (roomData.ready[0] && roomData.ready[1]) {
      for (let i = 0; i < 3; i++) {
        if (roomData.players.p1.turn.no === i + 1) {
          roomData.matchTurns[i] = 'p1'
        } else if (roomData.players.p2.turn.no === i + 1) {
          roomData.matchTurns[i] = 'p2'
        } else {
          roomData.matchTurns[i] = 'npc'
        }
      }
      io.to(room).emit('start-match', roomData.matchTurns[0], roomData.players.p1.isAttacker)
      if (roomData.matchTurns[0] === 'npc') {
        const npcChoice = Math.floor(Math.random() * 10)
        roomData.enemyField.push(roomData.npc.deck[npcChoice])
        io.to(room).emit('npc-play', roomData.npc.deck[npcChoice])
        roomData.matchIndex++
        io.to(room).emit('next-turn', roomData.matchTurns[roomData.matchIndex])
      }
      roomData.ready = [false, false]
    }
  })

  socket.on('publish-attacker', (room, attackers) => {
    const roomData = roomsData.get(room)
    for (let i = 0; i < attackers.length; i++) {
      roomData.npc.health -= attackers[i].attack
    }
    io.to(room).emit('notify-npc-health', roomData.npc.health)
  })

  socket.on('pass-turn', (room) => {
    const roomData = roomsData.get(room)
    roomData.matchIndex++
    if (roomData.matchIndex === 3) {
      roomData.matchIndex = 0
    }
    if (roomData.matchTurns[roomData.matchIndex] === 'npc') {
      if (roomData.enemyField.length < 4) {
        const npcChoice = Math.floor(Math.random() * 10)
        roomData.enemyField.push(roomData.npc.deck[npcChoice])
        io.to(room).emit('npc-play', roomData.npc.deck[npcChoice])
      }
      roomData.matchIndex++
    }
    io.to(room).emit('next-turn', roomData.matchTurns[roomData.matchIndex])
  })

  /* Ao tentar jogar uma carta */
  socket.on('play-card', (room, cardObject) => {
    io.to(room).emit('summon-ally-troup', cardObject)
  })

  socket.on('players-ready', (room, npcDeck) => {
    const npcChoice = Math.floor(Math.random() * 3)
    roomsData.get(room).npc.deck = npcDeck
    roomsData.get(room).npc.turn = npcChoice
    io.to(room).emit('npc-choice', npcChoice)
  })

  socket.on('occupy-turn', (room, player, turn) => {
    const roomData = roomsData.get(room)

    roomData.players[player].turn = turn
    io.to(room).emit('notify-turn', roomData.players)
  })

  socket.on('undo-turn', (room, player) => {
    const roomData = roomsData.get(room)

    roomData.players[player].turn = { no: 0, isAttacker: false }
    io.to(room).emit('notify-turn', roomData.players)
  })
})

/* Função que gera valores 1000 ~ 9999 não-utilizados em salas */
function rngRoom () {
  const min = 1000
  const max = 9999
  const rng = Math.floor(Math.random() * (max - min + 1) + min)
  if (io.sockets.adapter.rooms.has(rng)) { this.rngRoom() }
  return rng
}

app.use(express.static('../client/'))
server.listen(PORT, () => console.log(`Server started at ${PORT} port!\n`))
