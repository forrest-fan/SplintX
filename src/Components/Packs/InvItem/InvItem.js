import React from 'react';
import './InvItem.css';

const imgs = {
	LEGENDARY: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/potions/potion_legendary.png',
	GOLD: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/potions/potion_gold.png',
	MYSTERY: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/potions/potion_12.png',
	QUEST: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/potions/potion_9.png',
	UNTAMED: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/img_pack_untamed.png',
	BETA: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/img_pack_beta.png',
	ALPHA: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/open_packs/img_alpha-pack.png',
	ORB: 'https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/open_packs/img_essence-orb.png'
}
const potion = ['LEGENDARY', 'GOLD', 'MYSTERY', 'QUEST'];
const pack = ['UNTAMED', 'BETA', 'ALPHA'];
const orb = ['ORB'];


class InvItem extends React.Component {
	render() {
		console.log(this.props.name);
		return (
			<div className='inv-item-container'>
				<img src={imgs[this.props.name]} />
				<div className='inv-item-qty'>x{this.props.balance}</div>
				<p>{potion.includes(this.props.name) ? this.props.name.charAt(0) + this.props.name.substring(1).toLowerCase() + ' Potion' : 
					pack.includes(this.props.name) ? this.props.name.charAt(0) + this.props.name.substring(1).toLowerCase() + ' Pack' :
					orb.includes(this.props.name) ? 'Essence Orbs' : ''}</p>
			</div>
		);
	}
}

export default InvItem;