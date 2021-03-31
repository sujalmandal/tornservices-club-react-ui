import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, NavDropdown } from 'react-bootstrap';
import { logout } from './LoggedInViewSlice';
import { selectPlayerInfo } from '../shared-vars/SharedCacheSlice';

export function LoggedInView() {

    const globalPlayerInfo = useSelector(selectPlayerInfo);
    const dispatch = useDispatch();
    
    return (
        <div>
            <NavDropdown title={globalPlayerInfo.tornPlayerName} id="basic-nav-dropdown">
                <NavDropdown.Item>Accepted Jobs</NavDropdown.Item>
                <NavDropdown.Item>Posted Jobs</NavDropdown.Item>
                <NavDropdown.Divider/>
                <NavDropdown.Item>
                    <Button variant="outline-danger" onClick={()=>{dispatch(logout())}}>Logout</Button>
                </NavDropdown.Item>
            </NavDropdown>
        </div>
    );

}