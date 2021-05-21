import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes'; // {} because pulling off 1 thing that routes.js exports

const Header = (props) => {
    // use 2 {{}} to use object literal (js) in jsx, 1st says going to, 2nd does it
    return (
        <Menu style={{ marginTop: '10px' }}>
            <Link route='/' >
                <a className='item'>CrowdCoin</a>
            </Link>

            <Menu.Menu position='right'>

            <Link route='/' >
                <a className='item'>Campaigns</a>
            </Link>

            <Link route='/campaigns/new' >
                <a className='item'>+</a>
            </Link>

            </Menu.Menu>
        </Menu>
    );
};

export default Header
