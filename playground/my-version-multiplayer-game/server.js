import { create } from 'domain'
import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import createGame from './public/game.js'
const PORT = 3333

const app = express()
const server = http.createServer(app)
const sockets = new Server(server)

app.use(express.static('public'))

const game = createGame()
game.start()

// game.addPLayer({playerId:'player1', x:0, y:0})
// game.addPLayer({playerId:'player2', x:2, y:2})
// game.addFruit({fruitId:'fruit1', x:5, y:5})
// game.addFruit({fruitId:'fruit2', x:7, y:7})

console.log('game', game.state)
const state = game.state

game.subscribe((command) => {
  console.log(`Emiting command type: ${command.type}`)
  sockets.emit(command.type, command)
})

sockets.on('connection', (socket)=>{
  const playerId = socket.id
  console.log(` >> player connected on server with id: ${playerId}`)

  game.addPlayer({playerId : playerId})

  socket.emit('setup', state)

  socket.on('disconnect', ()=>{
    game.removePlayer({playerId: playerId})
    console.log(`Plyer: ${playerId} was disconnected`)
  })

  socket.on('move-player', (command)=>{
    command.playerId = playerId
    command.type = 'move-player'
    game.movePlayer(command)
  })
})

server.listen(PORT, ()=>{
  console.log(`🚀 server is running on port ${PORT}`)
})
