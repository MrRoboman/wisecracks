import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

import c from '../constants'

import Login from './login'
import Game from './game'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      room: c.LOGIN,
      players: []
    }
  }

  componentWillMount() {
    document.addEventListener('touchmove', function(e) {
    	e.preventDefault();
    }, false);

    this.socket = io('/')

    this.socket.on(c.JOIN, data => {
      console.log(data.joiningPlayer + ' joined!')
      this.setState({ players: data.players })
    })

    this.socket.on(c.LEAVE, data => {
      console.log(data.leavingPlayer + ' left!')
      this.setState({ players: data.players })
    })

    this.socket.on(c.GAMESTATE, data => {
      this.setState({
        room: data.room,
        players: data.players
      })
    })
  }

  render() {

    switch(this.state.room) {
      case c.LOGIN: return <Login socket={this.socket}/>
      case c.GAME: return <Game socket={this.socket} players={this.state.players}/>
      default: return <span>ERROR</span>
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
