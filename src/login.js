import React from 'react'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { name: '' }
  }

  onChange = event => {
    this.setState({ name: event.target.value })
  }

  handleSubmit = event => {
    this.props.socket.emit('join', name)
  }

  render() {
    let button;
    if(/^\S/.test(this.state.name)){
      button = <button onClick={this.handleSubmit}>enter the game</button>
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
        {button}
      </div>
    )
  }
}

export default Login
