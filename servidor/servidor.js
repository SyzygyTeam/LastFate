const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || 3000

/* Ao conectar ao servidor */
io.on('connection', (socket) => {
  console.log('User %s has connected.', socket.id)

  /* Ao criar uma sala aleatória */
  socket.on('create-room', () => {
    const room = rngRoom()
    socket.join(room)
    console.log('User %s has created the room %s.', socket.id, room)

    const players = {
      p1: socket.id,
      p2: undefined
    }

    io.to(room).emit('players', players)
  })

  /* Ao entrar numa sala existente */
  socket.on('enter-room', (room) => {
    /* Checa a existência da sala e se está cheia */
    if (!io.sockets.adapter.rooms.has(room) ||
      io.sockets.adapter.rooms.get(room).size === 2) { return false }

    socket.join(room)
    console.log('User %s has entered the room %s.', socket.id, room)

    const [p1] = io.sockets.adapter.rooms.get(room)
    const players = {
      p1,
      p2: socket.id
    }

    console.log('Room filled. Match starting!', room)
    io.to(room).emit('players', players)
  })

  socket.on('publish-state', (room, state) => {
    socket.broadcast.to(room).emit('notification-state', state)
  })

  /* TODO:
  socket.on('artefatos-publicar', (room, artefatos) => {
    socket.broadcast.to(room).emit('artefatos-notificar', artefatos)
  })
  */

  socket.on('offer', (room, description) => {
    socket.broadcast.to(room).emit('offer', description)
  })

  socket.on('candidate', (room, candidate) => {
    socket.broadcast.to(room).emit('candidate', candidate)
  })

  socket.on('answer', (room, description) => {
    socket.broadcast.to(room).emit('answer', description)
  })

  socket.on('disconnect', () => {
    console.log('User %s has disconnected.', socket.id)
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

app.use(express.static('../cliente/'))
server.listen(PORT, () => console.log(`Server started at ${PORT} port!\n`))
