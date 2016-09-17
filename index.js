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

const clients = {}

function broadcastPlayers() {
  const players = []
  for(var key in clients) {
    if(clients[key].name)
      players.push(clients[key])
  }
  io.sockets.emit(c.PLAYERS, players)
}

io.on(c.CONNECTION, socket => {

  clients[socket.id] = { name: '' }

  socket.on(c.JOIN, name => {
    clients[socket.id].name = name
    socket.emit(c.GAMESTATE, c.LOBBY)
    socket.broadcast.emit(c.JOIN, name)
    broadcastPlayers()
  })

  socket.on(c.DISCONNECT, () => {
    const name = clients[socket.id].name
    delete clients[socket.id]
    socket.broadcast.emit(c.LEAVE, name)
    broadcastPlayers()
  })

})

server.listen(3000)
