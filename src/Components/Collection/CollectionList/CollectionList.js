import React from 'react';
import './CollectionList.css';
import CollectionCard from './CollectionCard/CollectionCard';

class CollectionList extends React.Component {
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
      <div className="collectionList-container">
        <div className='collectionList-sort-container'>
          <p className='collectionList-info'>
            <span className='collectionList-resultCount'>{this.props.cards.length} Results</span>
            <span className='collectionList-filterCount' onClick={this.props.showMobileFilters}>{this.props.filterCount === 0 ? 'Add Filters (0)' : 'Edit Filters (' + this.props.filterCount +')'}</span>
          </p>
          <span className='collectionList-sort-input'>
            Sort by: 
            <select onChange={this.handleSortChange} defaultValue='splinter'>
              <option value='splinter'>Splinter</option>
              <option value='az'>Name: A - Z</option>
              <option value='za'>Name: Z - A</option>
              <option value='manaAsc'>Mana: Low - High</option>
              <option value='manaDes'>Mana: High - Low</option>
            </select>
          </span>
        </div>
      	<div className='collectionList'>
	         {this.props.loading ?
            <div className='loader-container'><div className='loader'></div></div> :
            this.props.cards.length === 0 ?
              <p className='collection-noCards'>No cards were found. Please update the filters.</p> : 
              this.props.cards.map(card => {
                return (<CollectionCard info={card} />);
              })
           }
	      </div>
      </div>
    );
  }
}

export default CollectionList;