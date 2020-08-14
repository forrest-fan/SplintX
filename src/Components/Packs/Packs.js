import React from 'react';
import './Packs.css';
import PackItem from './PackItem/PackItem';
import InvItem from './InvItem/InvItem';

const inventory = ['LEGENDARY', 'GOLD', 'UNTAMED', 'ORB', 'ALPHA', 'BETA', 'MYSTERY', 'QUEST'];

const packs = [
	{
		name: 'Untamed Booster Pack',
		description: `Each pack contains 5 cards randomly selected from the UNTAMED set. Each pack is guaranteed to contain at least one RARE card or better. Every 100,000 packs sold will unlock a new card that will be airdropped to players who have already purchased packs and will be added to packs going forward.`,
		price: 2000,
		code: 'booster_pack',
		img: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/img_pack_untamed.png'
	}
];

class Packs extends React.Component {
	render() {
		return (
			<div id='packs' className='page'>
				<div className='header'>
					<h2>Buy Packs</h2>
					<hr />
				</div>
				<div>
					<h2>Packs and Items</h2>
					<div className='packs-container'>
						{packs.map(packItem => {
						  	return <PackItem item={packItem} balance={this.props.balance} />;
						})}
					</div>
				</div>
				<div>
					<h2>Inventory</h2>
					<div className='inventory-container'>
						{this.props.loggedIn ? Object.keys(this.props.balance).map(key => {
							if (inventory.includes(key) && this.props.balance[key] > 0) {
								return <InvItem name={key} balance={this.props.balance[key]} />;
							}
						}) : <p style={{fontSize: '20px', textAlign: 'center'}}>Please log in to view your inventory</p>}
					</div>
				</div>
			</div>
		);
	}
}

export default Packs;