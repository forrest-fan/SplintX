import React from 'react';

class BattleStats extends React.Component {
	render() {
		return (
			<div className='stats-overview'>
		      <h3>Overview</h3>
		      <div className='overview-stat'>
		        <h4>{this.props.stats.wins}-{this.props.stats.losses}</h4>
		        <p>W/L</p>
		      </div>
		      <div className='overview-stat'>
		        <h4>{this.props.stats.streak}</h4>
		        <p>STREAK</p>
		      </div>
		      <div className='overview-stat'>
		        <h4>{this.props.stats.league}</h4>
		        <p>LEAGUE</p>
		      </div>
		      <div className='overview-stat'>
		        <h4>{this.props.stats.score}</h4>
		        <p>SCORE</p>
		      </div>
		    </div>
		);
	}
}

export default BattleStats;