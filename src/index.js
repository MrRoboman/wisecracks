import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

import c from '../constants'

import Login from './login'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { gameState: c.LOGIN }
  }

  componentWillMount() {
    document.addEventListener('touchmove', function(e) {
    	e.preventDefault();
    }, false);

    this.socket = io('/')

    this.socket.on(c.JOIN, name => {
      console.log(name + ' joined!')
    })

    this.socket.on(c.LEAVE, name => {
      console.log(name + ' left!')
    })

    this.socket.on(c.PLAYERS, players => {
      console.log(players)
      this.setState({ players })
    })

    this.socket.on(c.GAMESTATE, gameState => {
      this.setState({ gameState })
    })
  }

  render() {

    switch(this.state.gameState) {
      case c.LOGIN: return <Login socket={this.socket}/>
      case c.LOBBY: return <span>Dont be a freak</span>
      default: return <span>ERROR</span>
    }
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
