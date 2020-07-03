import React from 'react';
import './Navbar.css';

const pages = {
  market: 'Market',
  collection: 'My Collection',
  stats: 'Stats',
  packs: 'Packs',
  battlechain: 'Battle Chain',
  scanner: 'Scanner'
};

class Navbar extends React.Component {

  openSidebar() {
    document.getElementById('navSidebar').className = 'nav-sidebar show-sidebar';
    document.getElementById('sidebarOverlay').style.display = 'block';
  }

  closeSidebar() {
    document.getElementById('navSidebar').className = 'nav-sidebar hide-sidebar';
    document.getElementById('sidebarOverlay').style.display = 'none';
  }

  render() {
    return(
      <nav className="navbar" id='test'>
        <div className="navbar-title" href="">SplintX</div>
        <div className="navbar-links-container">
          <ul className="">
            {Object.keys(pages).map(navItem => {
              let navClass = 'nav-item';
              if (navItem === this.props.active) {
                navClass += ' active';
              }
              return (
                <li className={navClass}>
                  <a className="nav-link" onClick={() => {this.props.updatePage(navItem)}}>{pages[navItem]}</a>
                </li>
              );
            })}
            <div className="login-btn nav-item">Login</div>
            <div className="bars-btn nav-item-small" onClick={this.openSidebar}><i className='fas fa-bars'></i></div>
          </ul>
           <div className='sidebar-overlay' style={{display: 'none'}} onClick={this.closeSidebar} id='sidebarOverlay'></div>
           <div className='nav-sidebar hide-sidebar' id='navSidebar'>
            <div className='exit-btn' onClick={this.closeSidebar}><i className='fas fa-times'></i></div>
            <ul className="nav-sidebar-container">
              {Object.keys(pages).map(navItem => {
                return (
                  <li className='nav-item-side'>
                    <a className="nav-link" onClick={() => {
                      this.closeSidebar();
                      this.props.updatePage(navItem);
                    }}>{pages[navItem].toUpperCase()}</a>
                  </li>
                );
              })}
              <li className='nav-item-side login-side'>
                LOGIN
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;