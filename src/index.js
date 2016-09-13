import React from 'react'
import ReactDOM from 'react-dom'
import io from 'socket.io-client'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: '' }
  }

  componentDidMount() {
    document.addEventListener('touchmove', function(e) {
    	e.preventDefault();
    }, false);

    this.socket = io('/')

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

  onChange = event => {
    this.setState({ name: event.target.value })
  }

  handleSubmit = event => {
    this.socket.emit('join', name)
    this.setState({ nextPage: true })
  }

  renderButton = () => {
    if(/^\S/.test(this.state.name)) {
      return <button onClick={this.handleSubmit}>enter the game</button>
    }
  }

  render() {
    if(this.state.nextPage) {
      return <span>Game on {this.state.name}</span>
    }
    return (
      <div className="welcome">
        <h1>Wise Cracks!</h1>
        <input
          type='text'
          placeholder='enter your name'
          value={this.state.name}
          onChange={this.onChange}
          />
        {this.renderButton()}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
