import React from 'react';
import './Packs.css';
import PackItem from './PackItem/PackItem';

const inventory = ['LEGENDARY', 'GOLD', 'UNTAMED', 'ORB', 'ALPHA', 'BETA'];

const packs = [
	{
		name: 'Untamed Booster Pack',
		description: `Each pack contains 5 cards randomly selected from the UNTAMED set. Each pack is guaranteed to contain at least one RARE card or better. Every 100,000 packs sold will unlock a new card that will be airdropped to players who have already purchased packs and will be added to packs going forward.`,
		price: 2000,
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
					{packs.map(packItem => {
					  	return <PackItem item={packItem} />;
					})}
				</div>
				<div>
					<h2>Inventory</h2>
					{Object.keys(this.props.balance).map(key => {
						if (inventory.includes(key)) {
							if (this.props.balance[key] > 0) {
								return <p>{key}</p>;
							}
						}
					})}
				</div>
			</div>
		);
	}
}

export default Packs;