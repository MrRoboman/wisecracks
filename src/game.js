import React from 'react'
import c from '../constants'

class Game extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const players = this.props.players.map((player, idx) => {
      return <li key={idx}>{player.name}</li>
    })
    return (
      <div>
        <ul>
          {players}
        </ul>
      </div>
    )
  }
}

export default Game
