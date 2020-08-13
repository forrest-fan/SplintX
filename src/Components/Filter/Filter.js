import React from 'react';
import './Filter.css';
const filters = {
  foil: ['Regular', 'Gold'],
  type: ['Monster', 'Summoner'],
  rarity: ['Common', 'Rare', 'Epic', 'Legendary'],
  edition: ['Alpha', 'Beta', 'Promo', 'Reward', 'Untamed'],
  element: ['Fire', 'Water', 'Earth', 'Life', 'Death', 'Dragon', 'Neutral']
};

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFilters: ['Untamed']
    }
    this.getCategory = this.getCategory.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  getCategory(filter) {
    let category = '';
    Object.keys(filters).map(filterSection => {
      if (filters[filterSection].includes(filter)) {
        category = filterSection;
      }
    });
    return category;
  }

  handleSearchChange(event) {
    let query = event.target.value;
    this.props.updateFilters(query, 'search');
  }

  clearFilters() {
    this.setState({activeFilters: []});
    this.props.updateFilters(null, null, 'clear');
  }

  render() {
    return(
      <div className={this.props.mobileFilters ? 'filter-pane show-sidebar' : 'filter-pane hide-sidebar'} >
        <div className='exit-btn' onClick={this.props.hideMobileFilters}><i className='fas fa-times'></i></div>
        <input className='filter-search' placeholder='Search Cards' onChange={this.handleSearchChange}/>
        <h2 className='filter-header'>Filters</h2>
        <div className='activeFilters-container'>
          {this.state.activeFilters.map(filter => {
            return (
              <p className='activeFilter' onClick={() => {
                let activeFilters = this.state.activeFilters;
                for (let i = 0; i < activeFilters.length; i++) {
                  if (activeFilters[i] === filter) {
                    activeFilters.splice(i, 1);
                    this.setState({activeFilters: activeFilters});
                    break;
                  }
                }
                this.props.updateFilters(filter, this.getCategory(filter), 'remove');
              }}>{filter} ⨯</p>
            );
          })}
        </div>
        {this.state.activeFilters.length !== 0 ? <p className='clearFilters' onClick={this.clearFilters}>Clear Filters</p> : ''}
        {Object.keys(filters).map(filterSection => {
          return (
            <div className='filter-section'>
            <h2 className='filter-section-header'>{filterSection.toUpperCase()}</h2>
              {filters[filterSection].map(filter => {
                let iconClass = filterSection + '-icon';
                if (filterSection === 'rarity') {
                  iconClass += ' fas fa-circle ' + filter.toLowerCase();
                } else if (filterSection === 'element') {
                  iconClass += ' ' + filter.toLowerCase() + ' fas ';
                  iconClass += filter === 'Fire' ? 'fa-fire' : filter === 'Water' ? 'fa-tint' : filter === 'Earth' ? 'fa-leaf' : filter === 'Life' ? 'fa-star-of-life' : filter === 'Death' ? 'fa-skull' : filter === 'Dragon' ? 'fa-dragon' : 'fa-dumbbell';
                } else if (filterSection === 'gold') {
                  iconClass += ' fas fa-star';
                }
                return (
                  <p className='filter-selection' id={filter} onClick={() => {
                    let activeFilters = this.state.activeFilters;
                    if (!activeFilters.includes(filter)) {
                      activeFilters.push(filter);
                      this.setState({activeFilters: activeFilters});
                      this.props.updateFilters(filter, filterSection, 'add');
                    }
                  }}><i className={iconClass}>{filterSection === 'edition' || filterSection === 'type' ? filter.substring(0, 1).toUpperCase() : ''}</i>{filter}</p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Filter;