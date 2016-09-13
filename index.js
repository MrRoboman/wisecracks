const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const socketIo = require('socket.io')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')

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
  io.sockets.emit('players', players)
}

io.on('connection', socket => {

  clients[socket.id] = { name: '' }

  socket.on('join', name => {
    clients[socket.id].name = name
    socket.broadcast.emit('join', name)
    broadcastPlayers()
  })

  socket.on('disconnect', () => {
    const name = clients[socket.id].name
    delete clients[socket.id]
    socket.broadcast.emit('leave', name)
    broadcastPlayers()
  })

  socket.on('message', body => {
    socket.broadcast.emit('message', {
      body,
      from: socket.id.slice(8)
    })
  })

})

server.listen(3000)
