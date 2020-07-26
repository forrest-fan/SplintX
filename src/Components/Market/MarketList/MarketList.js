import React from 'react';
import './MarketList.css';
import MarketCard from './MarketCard/MarketCard';

class MarketList extends React.Component {
  constructor(props) {
    super(props);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  handleSortChange(e) {
    let sortMethod = e.target.value;
    this.props.updateSort(sortMethod);
  }

  render() {
    return(
      <div className="marketList-container">
        <div className='marketList-sort-container'>
          <p className='marketList-info'>
            <span className='marketList-resultCount'>{this.props.cards.length} Results</span>
            <span className='marketList-filterCount' onClick={this.props.showMobileFilters}>{this.props.filterCount === 0 ? 'Add Filters (0)' : 'Edit Filters (' + this.props.filterCount +')'}</span>
          </p>
          <span className='marketList-sort-input'>
            Sort by: 
            <select onChange={this.handleSortChange} defaultValue='splinter'>
              <option value='splinter'>Splinter</option>
              <option value='az'>Name: A - Z</option>
              <option value='za'>Name: Z - A</option>
              <option value='priceAsc'>Price: Low - High</option>
              <option value='priceDec'>Price: High - Low</option>
              <option value='priceBCXAsc'>Price/BCX: Low - High</option>
              <option value='priceBCXDec'>Price/BCX: High - Low</option>
              <option value='qtyAsc'>Quantity: Low - High</option>
              <option value='qtyDec'>Quantity: High - Low</option>
            </select>
          </span>
        </div>
      	<div className='marketList'>
	        {this.props.loading ?
	        	<div className='loader-container'><div className='loader'></div></div> :
	        this.props.cards.length === 0 ?
              	<p className='market-noCards'>No cards were found. Please update the filters.</p> : 
              	this.props.cards.map(card => {
                	return (<MarketCard info={card} cart={this.props.cart} addToCart={this.props.addToCart} />);
              	})
           }
	      </div>
      </div>
    );
  }
}

export default MarketList;