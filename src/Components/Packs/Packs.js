import React from 'react';
import './Packs.css';
import PackItem from './PackItem/PackItem';

const packs = [
	{
		name: 'Untamed Booster Pack',
		description: `Each pack contains 5 cards randomly selected from the UNTAMED set. Each pack is guaranteed to contain at least one RARE card or better.\n
		The UNTAMED set features over 70 new cards, with 1.5 million packs available for sale.\n
		Airdrops: Every 100,000 packs sold will unlock a new card that will be airdropped to players who have already purchased packs and will be added to packs going forward.`,
		price: 2000,
		acceptedCurrencies: ['DEC'],
		img: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/logo_untamed.png'
	}, 
	{
		name: 'Essence Orbs',
		description: `Each Orb contains 5 cards randomly selected from the WINDS OF CHANGE collection. Each Orb is guaranteed to contain at least one RARE card or better`,
		price: 2500,
		acceptedCurrencies: ['DEC'],
		img: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/img_artifacts-dealer_brushed.png'
	}
];

class Packs extends React.Component {
	render() {
		return (
			<div id='packs'>
			  <h1>Buy Packs and Items</h1>
			  {packs.map(packItem => {
			  	return <PackItem item={packItem} />
			  })}
			</div>
		);
	}
}

export default Packs;