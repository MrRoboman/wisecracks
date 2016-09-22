'use strict'

const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')

const c = require('./constants')

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

app.use(express.static(__dirname + '/public'))
app.use(webpackDevMiddleware(webpack(webpackConfig)))
app.use(bodyParser.urlencoded({ extended: false }))


class Player {
  constructor() {
    this.name = ''
    this.messageComplete = false
  }
}

class Clients {
  constructor() {
    this.clients = {}
    // this.players = []
  }

  add(id) {
    const player = new Player
    this.clients[id] = player
    // this.players.push(player)
  }

  remove(id) {
    const client = this.clients[id]
    delete this.clients[id]
    return client
  }

  name(id, name) {
    if(name === undefined) {
      return this.clients[id].name
    } else {
      this.clients[id].name = name
    }
  }

  player(id) {
    return this.clients[id]
  }

  players() {
    const players = []
    for(let sckId in this.clients) {
      if(this.clients[sckId].name)
        players.push(this.clients[sckId])
    }
    return players
  }
}

const clients = new Clients

io.on(c.CONNECTION, socket => {

  const id = socket.id
  clients.add(id)

  socket.on(c.JOIN, name => {
    clients.name(id, name)
    socket.emit(c.GAMESTATE, {
      room: c.GAME,
      players: clients.players()
    })
    socket.broadcast.emit(c.JOIN, {
      joiningPlayer: clients.player(id).name,
      players: clients.players()
    })
  })

  socket.on(c.DISCONNECT, () => {
    const player = clients.remove(id)
    socket.broadcast.emit(c.LEAVE, {
      leavingPlayer: player.name,
      players: clients.players()
    })
  })

})

server.listen(3000)
