import React from 'react';
import PackModal from './PackModal/PackModal';
import './PackItem.css';

class PackItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {openModal: false};
		this.toggleModal = this.toggleModal.bind(this);
	}

	toggleModal() {
		this.state.openModal ? this.setState({openModal: false}) : this.setState({openModal: true});
	}

	render() {
		return (
			<div className='item-container'>
				<div className='pack-item' onClick={this.toggleModal}>
				    <img src={this.props.item.img} className='item-img'/>
				    <div className='item-text'>
				    	<h2>{this.props.item.name}</h2>
				    	<p className='price'>{this.props.item.price.toLocaleString()} DEC</p>
				    </div>
				</div>
				{this.state.openModal ? <PackModal updateBalance={this.props.updateBalance} balance={this.props.balance} item={this.props.item} closeModal={this.toggleModal}/> : ''}
			</div>
		);
	}
}

export default PackItem;