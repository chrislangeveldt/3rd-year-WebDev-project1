import React from 'react';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types'

const Menu = ({ all, open, closed }) => {
    return (
        <div className="menu">
            <Popup
                trigger={<div className="menu-item"> Sort Contracts </div>}
                position="right top"
                on="hover"
                closeOnDocumentClick
                mouseLeaveDelay={300}
                mouseEnterDelay={0}
                contentStyle={{ padding: '0px', border: 'none' }}
                arrow={false}
            >
                <div className="menu">
                    <button onClick = {all} className="menu-item" > All contracts 
                    </button>
                    <button onClick = {open} className="menu-item" > Open contracts 
                    </button>
                    <button onClick = {closed} className="menu-item" > Closed contracts 
                    </button>
                </div>
            </Popup>
        </div>
    )
};

Menu.propTypes = {
    onClick: PropTypes.func,
  }

export default Menu