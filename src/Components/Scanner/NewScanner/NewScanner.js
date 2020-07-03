import React from 'react';

class NewScanner extends React.Component {
	constructor(props) {
		super(props);
		this.addScanner = this.addScanner.bind(this);
	}

	addScanner() {
		const name = document.getElementById('name').value

		const elements = [];
		for (let i = 0; i < document.getElementsByClassName('elementCheck').length; i++) {
			if (document.getElementsByClassName('elementCheck')[i].checked) {
				elements.push(document.getElementsByClassName('elementCheck')[i].value);
			}
		}
		if (elements.length === 0) {
			elements.push('All');
		}

		const rarity = [];
		for (let i = 0; i < document.getElementsByClassName('rarityCheck').length; i++) {
			if (document.getElementsByClassName('rarityCheck')[i].checked) {
				rarity.push(document.getElementsByClassName('rarityCheck')[i].value);
			}
		}
		if (rarity.length === 0) {
			rarity.push('All');
		}

		var minMana = 0;
		var maxMana = 10;
		var minPrice = 0;
		var maxPrice = 100000;

		if (document.getElementById('minMana').value) {
			minMana = document.getElementById('minMana').value;
		}

		if (document.getElementById('maxMana').value) {
			maxMana = document.getElementById('maxMana').value;
		}

		if (document.getElementById('minPrice').value) {
			minPrice = document.getElementById('minPrice').value;
		}

		if (document.getElementById('maxPrice').value) {
			maxPrice = document.getElementById('maxPrice').value;
		}

		const alert = document.getElementById('alert').value;

		const newScanner = {
			name: name,
			elements: elements,
			rarity: rarity,
			manaMin: minMana,
			manaMax: maxMana,
			priceMin: minPrice,
			priceMax: maxPrice, 
			alert: alert
		}

		this.props.addScanner(newScanner);
	}

	render() {
		return (
			<div className='add-scanner-modal'>
			    <div className='add-scanner-content'>
			      <div className='close-modal' onClick={this.props.closeModal}>⨯</div>
			      <h2>New Market Scanner</h2>
			      <form className='scanner-form'>
			        <div className='scanner-col'>
			          <label for='name'>Name:</label><br/><input placeholder='My New Scanner' id='name' name='name' required/><br/>
			          <div id='elements'>
			            <label for='elements'>Elements:</label><br/>
			              <input type='checkbox' name='fire' value='Fire' className='elementCheck'/>
			              <label for='fire'>Fire</label><br/>
			              <input type='checkbox' name='water' value='Water' className='elementCheck'/>
			              <label for='water'>Water</label><br/>
			              <input type='checkbox' name='earth' value='Earth' className='elementCheck'/>
			              <label for='earth'>Earth</label><br/>
			              <input type='checkbox' name='life' value='Life' className='elementCheck'/>
			              <label for='life'>Life</label><br/>
			              <input type='checkbox' name='death' value='Death' className='elementCheck'/>
			              <label for='death'>Death</label><br/>
			              <input type='checkbox' name='dragon' value='Dragon' className='elementCheck'/>
			              <label for='dragon'>Dragon</label><br/>
			              <input type='checkbox' name='normal' value='Normal' className='elementCheck'/>
			              <label for='normal'>Normal</label><br/>
			            </div>
			        </div>
			        <div className='scanner-col'>
			          <div id='rarity'>
			          <label for='rarity'>Rarity:</label><br/>
			            <input type='checkbox' name='common' value='Common' className='rarityCheck'/>
			            <label for='common'>Common</label><br/>
			            <input type='checkbox' name='rare' value='Rare' className='rarityCheck'/>
			            <label for='rare'>Rare</label><br/>
			            <input type='checkbox' name='epic' value='Epic' className='rarityCheck'/>
			            <label for='epic'>Epic</label><br/>
			            <input type='checkbox' name='legendary' value='Legendary' className='rarityCheck'/>
			            <label for='legendary'>Legendary</label><br/>
			          </div>
			          <label for='mana-range'>Mana Range:</label><br/>
			          <input placeholder='Min Mana' type='number' id='minMana'/>
			          <input placeholder='Max Mana' type='number' id='maxMana'/><br/>
			          <label for='price-range'>Price Range:</label><br/>
			          <input placeholder='Min Price' type='number' id='minPrice'/>
			          <input placeholder='Max Price' type='number' id='maxPrice'/><br/>
			          <p><strong>Alert me</strong> when cards drop <input type='number' min='1' max='100' id='alert' required/> % below market price</p>
			        </div>
			        <div id='submit' onClick={this.addScanner}>Add Scanner</div>
			      </form>
			    </div>
			  </div>
		);
	}
}

export default NewScanner;