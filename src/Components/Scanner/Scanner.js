import React from 'react';
import './Scanner.css';
import NewScanner from './NewScanner/NewScanner';

var activeScanners = [{
	name: 'Scanner1',
	elements: ['Fire', 'Earth', 'Dragon'],
	rarity: ['Rare', 'Epic', 'Legendary'],
	manaMin: 0,
	manaMax: 10,
	priceMin: 0,
	priceMax: 1000,
	alert: 15
},
{
	name: 'Scanner2',
	elements: ['Water', 'Earth'],
	rarity: ['All'],
	manaMin: 4,
	manaMax: 10,
	priceMin: 10,
	priceMax: 1000,
	alert: 8
}]

class Scanner extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			scanners: activeScanners,
			renderModal: false
		};
		this.renderModal = this.renderModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.addScanner = this.addScanner.bind(this);
	}

	renderModal() {
		this.setState({renderModal: true});
	}

	closeModal() {
		this.setState({renderModal: false});
	}

	addScanner(scanner) {
		activeScanners.push(scanner);
		this.setState({scanners: activeScanners, renderModal: false});
	}

	render() {
		return (
			<div id='scanner'>
			  <h1>Market Scanner</h1>
			  <div className='scanner-container'>
			    <div className='scanner-header'><h2>My Scanners</h2><div className='add-scanner-btn' onClick={this.renderModal}>Add Scanner<span style={{marginLeft: '5px'}}>+</span></div></div>
			    <hr/>
			    <table className='scanner-table'>
			    	<thead>
				      <tr>
				        <th>Name</th>
				        <th>Elements</th>
				        <th>Rarity</th>
				        <th>Mana</th>
				        <th>Price range</th>
				        <th>Alert</th>
				      </tr>
				    </thead>
				    <tbody>
			      {this.state.scanners.map(scanner => {
			      	return (
			      		<tr>
			      			<td>{scanner.name}</td>
			      			<td>{scanner.elements.map(element => {
			      				if (scanner.elements.indexOf(element) !== scanner.elements.length - 1) {
			      					return(element + ', ');
			      				} else {
			      					return element;
			      				}
			      			})}</td>
			      			<td>{scanner.rarity.map(level => {
			      				if (scanner.rarity.indexOf(level) !== scanner.rarity.length - 1) {
			      					return (level + ', ');
			      				} else {
			      					return level;
			      				}
			      			})}</td>
			      			<td>{scanner.manaMin === 0 && scanner.manaMax === 10 ? (
			      				'All'
			      			) : scanner.manaMin === 0 ? (
			      				'< ' + scanner.manaMax
			      			) : scanner.manaMax === 10 ? (
			      				'> ' + scanner.manaMin
			      			) : (
			      				scanner.manaMin + ' - ' + scanner.manaMax
			      			)}</td>
			      			<td>{scanner.priceMin === 0 && scanner.priceMax === 100000 ? (
			      				'Any'
			      			) : scanner.priceMin === 0 ? (
			      				'< ' + scanner.priceMax.toLocaleString() + ' DEC'
			      			) : scanner.priceMax === 100000 ? (
			      				'> ' + scanner.priceMin.toLocaleString() + ' DEC'
			      			) : (
			      				scanner.priceMin.toLocaleString() + ' - ' + scanner.priceMax.toLocaleString() + ' DEC'
			      			)}</td>
			      			<td><strong>{scanner.alert}%</strong> below market price</td>
			      		</tr>
			      	);
			      })}
			      </tbody>
			    </table>
			  </div>
			  {this.state.renderModal ? <NewScanner closeModal={this.closeModal} addScanner={this.addScanner}/> : <div></div>}
			</div>
		);
	}
}

export default Scanner;