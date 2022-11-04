import React from 'react'
import './CSS/Home.css';
import CheckDev from './Other/CheckDev';


function Home() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.pathname = "/login";
  };
  const handleViewProfile = () => {
    window.location.pathname = "/ViewProfile";
  };
  return (
    <>
      <nav id="navbar" class="">
        <div className="nav-wrapper">
          <div className="logo">
            <label >DevCo</label>

          </div>

          <ul id="menu">
            <li>
              <a onClick={handleViewProfile}> Profile</a>
            </li>
            <li>
              <button className="styleBtn" onClick={handleLogout} >Logout </button>
            </li>
          </ul>
        </div>

      </nav>
      <CheckDev />

    </>


  )
}

export default Home;