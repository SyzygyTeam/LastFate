const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 3000

const rooms = {
  state: 0,
  size: 0,
  npc: {
    name: ''
  },
  allyField: {
    size: 0,
    units: []
  },
  enemyField: {
    size: 0,
    units: []
  }
}

/* Ao tentar conectar ao server */
io.on('connection', (socket) => {
  console.log(`User ${socket.id} has connected.`)

  /* Ao tentar criar uma sala aleatória */
  socket.on('create-room', () => {
    const room = rngRoom() // Gera um código de sala aleatório
    socket.join(room) // Entra no código gerado
    console.log(`User ${socket.id} has created the room ${room}.`)

    const players = {
      p1: socket.id,
      p2: undefined
    }

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

      const [p1] = io.sockets.adapter.rooms.get(room)
      const players = {
        p1,
        p2: socket.id
      }

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

  socket.on('publish-state', (room, state) => {
    socket.to(room).emit('notification-state', state)
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

  /* Ao tentar atualizar o deck do player */
  socket.on('publish-deck', (room, deck) => {
    socket.to(room).emit('notify-deck', deck)
  })

  /* Ao tentar jogar uma carta */
  socket.on('play-card', (room, cardObject) => {
    cardObject.x = 400
    cardObject.y = 225
    io.to(room).emit('summon-unit', cardObject)
  })
})

/* Função que gera valores 1000 ~ 9999 não-utilizados em salas */
function rngRoom () {
  // TODO: Restaurar essa função
  // const min = 1000
  // const max = 9999
  // const rng = Math.floor(Math.random() * (max - min + 1) + min)
  const rng = 1111
  // if (io.sockets.adapter.rooms.has(rng)) { this.rngRoom() }
  return rng
}

app.use(express.static('../client/'))
server.listen(PORT, () => console.log(`Server started at ${PORT} port!\n`))
