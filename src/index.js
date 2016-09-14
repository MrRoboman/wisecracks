import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

import Login from './login'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { gameState: 'LOGIN' }
  }

  componentWillMount() {
    document.addEventListener('touchmove', function(e) {
    	e.preventDefault();
    }, false);

    this.socket = io('/')

    this.socket.on('gameState', gameState => {
      this.setState({ gameState: gameState })
    })

    this.socket.on('join', name => {
      console.log(name + " joined!")
    })

    this.socket.on('leave', name => {
      console.log(name + " left!")
    })

    this.socket.on('players', players => {
      console.log(players)
      this.setState({ players: players })
    })
  }

  render() {

    switch(this.state.gameState) {
      case "LOGIN": return <Login socket={this.socket}/>
      case "LOBBY": return <span>Dont be a freak</span>
      default: return <span>ERROR</span>
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
