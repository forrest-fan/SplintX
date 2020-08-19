import React from 'react';
import './Packs.css';
import PackItem from './PackItem/PackItem';
import InvItem from './InvItem/InvItem';

const inventory = ['LEGENDARY', 'GOLD', 'UNTAMED', 'ORB', 'ALPHA', 'BETA', 'MYSTERY', 'QUEST'];

const packs = [
	{
		name: 'Untamed Pack',
		description: 'Each pack contains 5 cards randomly selected from the UNTAMED set. Each pack is guaranteed to contain at least one RARE card or better. Every 100,000 packs sold will unlock a new card that will be airdropped to players who have already purchased packs and will be added to packs going forward.',
		price: 2000,
		code: 'booster_pack',
		img: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/img_pack_untamed.png'
	}, {
		name: 'Legendary Potion',
		description: 'Improves the drop rate of legendary cards!',
		price: 40,
		code: 'potion',
		img: 'https://s3.amazonaws.com/steemmonsters/website/ui_elements/shop/potions/potion_legendary.png',
		potion_type: 'LEGENDARY'
	}, {
		name: 'Alchemy Potion',
		description: 'Improves the drop rate of gold cards!',
		price: 50,
		code: 'potion',
		img: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/potions/potion_6.png',
		potion_type: 'GOLD'
	}, {
		name: 'Quest Potion',
		description: 'Receive 5 Loot Chests after completing quests!',
		price: 750,
		code: 'potion',
		img: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/potions/potion_9.png',
		potion_type: 'QUEST'
	}, {
		name: 'Mystery Potion',
		description: 'Receive a daily random mystery prize!',
		price: 1200,
		code: 'potion',
		img: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/potions/potion_12.png',
		potion_type: 'MYSTERY'
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
						  	return <PackItem item={packItem} balance={this.props.balance} updateBalance={this.props.updateBalance} />;
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