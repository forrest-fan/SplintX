import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Market from './Components/Market/Market';
import Packs from './Components/Packs/Packs';
import BattleChain from './Components/BattleChain/BattleChain';
import Scanner from './Components/Scanner/Scanner';
import Collection from './Components/Collection/Collection';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'market'
    };
    this.renderPage = this.renderPage.bind(this);
    this.updatePage = this.updatePage.bind(this);
  }

  updatePage(newPage) {
    this.setState({
      page: newPage
    });
  }

  renderPage(page) {
    if (page === 'market') {
      return <Market / > ;
    } else if (page === 'collection') {
      return <Collection / >
    } else if (page === 'packs') {
      return <Packs / >
    } else if (page === 'battlechain') {
      return <BattleChain / >
    } else if (page === 'scanner') {
      return <Scanner / >
    }
  }

  render() {
    return ( 
      <div className = "App" >
        <Navbar active = {this.state.page} updatePage = {this.updatePage}/>
        {this.renderPage(this.state.page)}
      </div>
    );
  }
}

export default App;