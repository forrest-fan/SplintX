import React from 'react';
import './BattleChain.css';
import BattleStats from './BattleStats/BattleStats';
import BattleLog from './BattleLog/BattleLog';

const stats = {
	wins: 46,
	losses: 19,
	streak: 'W2',
	league: 'Bronze III',
	score: 631,
	last5: [{
		result: 'W',
		opponent: 'splinterfighter123',
		duration: 3,
		earnings: 0.32,
		scoreChange: 82,
		time: '3:21 PM, June 3, 2020',
		ownCards: [{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		}],
		opponentCards: [{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		}]
	},
	{
		result: 'W',
		opponent: 'splinterwarrior987',
		duration: 5,
		earnings: 0.412,
		scoreChange: 59,
		time: '3:01 PM, June 3, 2020',
		ownCards: [{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		}],
		opponentCards: [{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		}]
	},
	{
		result: 'L',
		opponent: 'splinterfighter123',
		duration: 2,
		earnings: 0,
		scoreChange: -12,
		time: '2:46 PM, June 3, 2020',
		ownCards: [{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		}],
		opponentCards: [{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		}]
	},
	{
		result: 'L',
		opponent: 'splinterchamp',
		duration: 5,
		earnings: 0,
		scoreChange: -25,
		time: '2:42 PM, June 3, 2020',
		ownCards: [{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		}],
		opponentCards: [{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		}]
	},
	{
		result: 'W',
		opponent: 'splintreboss321',
		duration: 4,
		earnings: 0.491,
		scoreChange: 73,
		time: '2:36 PM, June 3, 2020',
		ownCards: [{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		}],
		opponentCards: [{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		},
		{
			img: 'https://steemmonsters.s3.amazonaws.com/cards_untamed/Horny%20Toad.png'
		}]
	}]
}

class BattleChain extends React.Component {
	render() {
		return(
			<div id='battle-chain'>
			  <h1>Battle Chain</h1>
			  <div style={{overflow: 'auto'}}>
			    <div className='search-container'>
			      <input className='search-input' placeholder="Search Profiles" /><div className='search-btn'>Search</div>
			    </div>
			  </div>
			  <div className='stats-container'>
			    <div className='stats-header'>
			      <h2 className='stats-title'>Statistics</h2><h3 className='username'>@username</h3>
			    </div>
			    <hr/>
			    <BattleStats stats={stats}/>
			    <BattleLog battles={stats.last5}/>
			  </div>
			</div>
		);
	}
}

export default BattleChain;