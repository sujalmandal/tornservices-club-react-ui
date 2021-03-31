import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Nav, Button, Modal, Form, FormControl, Container, Navbarm, NavDropdown } from 'react-bootstrap';
import {
    login,
    register,
    selectPlayerInfo
} from './LoggedInViewSlice';

export function LoggedInView() {

    const globalPlayerInfo = useSelector(selectPlayerInfo);
    
    return (
        <div>
            <NavDropdown title={globalPlayerInfo.tornPlayerName} id="basic-nav-dropdown" onSelect="">
                <NavDropdown.Item>Accepted Jobs</NavDropdown.Item>
                <NavDropdown.Item>Posted Jobs</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                    <Button>Logout</Button>
                </NavDropdown.Item>
            </NavDropdown>
        </div>
    );

}