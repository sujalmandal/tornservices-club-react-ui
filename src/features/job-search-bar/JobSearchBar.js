import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container } from 'react-bootstrap';
import {
    searchJobs,
    selectGlobalJobFilters
} from './jobSearchBarSlice';
import styles from './JobSearchBar.module.css';

export function JobSearchBar() {

    const dispatch = useDispatch();

    /* redux, global states */
    const globalJobFilters = useSelector(selectGlobalJobFilters);

    /* local, feature-level states */
    const [jobFilters, setJobFilters] = useState({
        jobType: "Bounty",
        amount: 0
    });

    return (
        <div>
            <Navbar fixed="top" bg="dark" variant="dark" expand="lg">
                <Container><Navbar.Brand href="#home">Find available jobs </Navbar.Brand></Container>
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <NavDropdown title={"What kind?  " + jobFilters.jobType} id="basic-nav-dropdown" onSelect={(selectedItem) => {
                                setJobFilters({
                                    ...jobFilters,
                                    jobType: selectedItem
                                })
                            }}>
                                <NavDropdown.Item eventKey="Hospitalize">Hospitalize</NavDropdown.Item>
                                <NavDropdown.Item eventKey="Mug">Mug</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="Bounty reveal">Bounty reveal</NavDropdown.Item>
                                <NavDropdown.Item eventKey="Bounty">Bounty</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Form inline>
                            <Form.Label className="mr-sm-4" style={{ color: "gray" }}>How many?</Form.Label>
                            <FormControl style={{ width: "75px" }} max="99" value={jobFilters.amount} type="number" className="mr-sm-4" onChange={(e) => {
                                setJobFilters({
                                    ...jobFilters,
                                    amount: e.target.value
                                })
                            }} />
                            <Button onClick={() => { dispatch(searchJobs(jobFilters)) }} variant="outline-success" >Find!</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );

}