import React from 'react';
import './Navbar.css';
import LoginModal from './LoginModal/LoginModal';

const pages = {
  market: 'Market',
  collection: 'My Collection'
};

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderLogin: false
    };
    this.openSidebar = this.openSidebar.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  openSidebar() {
    document.getElementById('navSidebar').className = 'nav-sidebar show-sidebar';
    document.getElementById('sidebarOverlay').style.display = 'block';
  }

  closeSidebar() {
    document.getElementById('navSidebar').className = 'nav-sidebar hide-sidebar';
    document.getElementById('sidebarOverlay').style.display = 'none';
  }

  toggleLogin() {
    this.setState({
      renderLogin: this.state.renderLogin ? false : true
    });
  }

  handleLogout() {
    let toast = document.getElementById('navbar-logout-toast');
    toast.className = 'show';
    setTimeout(() => {toast.className = toast.className.replace('show', '')}, 3000)
    localStorage.removeItem("username");
    this.setState({loggedIn: false});
     this.props.login('');
  }

  render() {
    return(
      <nav className="navbar" id='test'>
        <div className="navbar-title" href="">Splint<span className='navbar-x-accent'>X</span></div>
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
            {this.props.loggedIn ? 
              <div className="login-btn nav-item" onClick={this.handleLogout}>Logout</div> :
              <div className="login-btn nav-item" onClick={this.toggleLogin}>Login</div> }
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
              {this.props.loggedIn ? 
                <li className='nav-item-side login-side' onClick={this.handleLogout}>
                  LOGOUT
                </li> :
                <li className='nav-item-side login-side' onClick={this.toggleLogin}>
                  LOGIN
                </li> }
            </ul>
          </div>
        </div>
        {this.state.renderLogin ? <LoginModal login={this.props.login} closeModal={this.toggleLogin}/> : ''}
        <div id='navbar-logout-toast'>
          <i className='fas fa-check'></i>Successfully Logged Out!
        </div>
      </nav>
    );
  }
}

export default Navbar;