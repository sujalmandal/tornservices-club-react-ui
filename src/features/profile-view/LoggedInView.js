import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Button, Modal, Form, FormControl, Container, Navbarm, NavDropdown } from 'react-bootstrap';
import { logout } from './LoggedInViewSlice';
import { selectPlayerInfo } from '../shared-vars/SharedCacheSlice';

export function LoggedInView() {

    const globalPlayerInfo = useSelector(selectPlayerInfo);
    
    return (
        <div>
            <NavDropdown title={globalPlayerInfo.tornPlayerName} id="basic-nav-dropdown" onSelect="">
                <NavDropdown.Item>Accepted Jobs</NavDropdown.Item>
                <NavDropdown.Item>Posted Jobs</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                    <Button variant="outline-danger">Logout</Button>
                </NavDropdown.Item>
            </NavDropdown>
        </div>
    );

}