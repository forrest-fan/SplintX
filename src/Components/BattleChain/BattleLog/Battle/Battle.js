import React from 'react';

class Battle extends React.Component {
	renderCards() {
		if (this.props.battle.result === 'W') {
			return (
				<div className='battle-cards'>
					<div className='own-cards win-cards'>
						{this.props.battle.ownCards.map(card => {
							const backgroundUrl = 'url(' + card.img + ')';
							return <div className='battle-card' style={{backgroundImage: backgroundUrl}}></div>
						})}
					</div>
					<div className='vs'>VS</div>
					<div className='opponent-cards loss-cards'>
						{this.props.battle.opponentCards.map(card => {
							const backgroundUrl = 'url(' + card.img + ')';
							return <div className='battle-card' style={{backgroundImage: backgroundUrl}}></div>
						})}
					</div>
				</div>
			);
		} else if (this.props.battle.result === 'L') {
			return (
				<div className='battle-cards'>
					<div className='own-cards loss-cards'>
						{this.props.battle.ownCards.map(card => {
							const backgroundUrl = 'url(' + card.img + ')';
							return <div className='battle-card' style={{backgroundImage: backgroundUrl}}></div>
						})}
					</div>
					<div className='vs'>VS</div>
					<div className='opponent-cards win-cards'>
						{this.props.battle.opponentCards.map(card => {
							const backgroundUrl = 'url(' + card.img + ')';
							return <div className='battle-card' style={{backgroundImage: backgroundUrl}}></div>
						})}
					</div>
				</div>
			);
		}
	}

	render() {
		return (
			<div className='battle'>
		        <h4>{this.props.battle.result === 'W' ? <span className='win'>W</span> : <span className='loss'>L</span>} vs {this.props.battle.opponent}</h4>
		          {this.renderCards()}
		          <div>
		            <div className='battle-stat'>
		              <p>Duration: <strong>{this.props.battle.duration} Rounds</strong></p>
		            </div>
		            <div className='battle-stat'>
		              <p>Earnings: <strong>{this.props.battle.earnings} DEC</strong></p>
		            </div>
		            <div className='battle-stat'>
		              <p>Score change: <strong>{this.props.battle.scoreChange > 0 ? '+' : ''}{this.props.battle.scoreChange}</strong></p>
		            </div>
		            <div className='battle-stat'>
		              <p>{this.props.battle.time}</p>
		            </div>
		          </div>
		      </div>
		);
	}
}

export default Battle;