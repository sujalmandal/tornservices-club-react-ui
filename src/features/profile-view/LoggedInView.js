import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, NavDropdown } from 'react-bootstrap';
import { } from './LoggedInViewSlice';
import { selectSharedState, wipeSharedState } from '../shared-vars/SharedStateSlice';

export function LoggedInView() {

    const sharedState = useSelector(selectSharedState);
    const dispatch = useDispatch();
    const handleLogout = function () {
        wipeSharedState(dispatch)
    }

    return (
        <div>
            <NavDropdown title={sharedState.tornUserName} id="basic-nav-dropdown">
                <NavDropdown.Item>Accepted Jobs</NavDropdown.Item>
                <NavDropdown.Item>Posted Jobs</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                    <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                </NavDropdown.Item>
            </NavDropdown>
        </div>
    );

}