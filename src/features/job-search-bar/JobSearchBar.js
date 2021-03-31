import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container, Col, Row } from 'react-bootstrap';
import {
    searchJobs,
    selectGlobalJobFilters
} from './JobSearchBarSlice';
import styles from './JobSearchBar.module.css';

export function JobSearchBar() {

    const yyyy_mm_dd = function(dateIn) {
        var yyyy = dateIn.getFullYear();
        var mm = dateIn.getMonth() + 1; 
        var dd = dateIn.getDate();
        var dateAsString = yyyy+"-"+mm+"-"+dd;
        console.log(dateAsString);
        return dateAsString; 
    }

    const dispatch = useDispatch();

    /* redux, global states */
    const globalJobFilters = useSelector(selectGlobalJobFilters);

    /* local, feature-level states */
    const [jobFilters, setJobFilters] = useState({
        jobType: "Bounty",
        amount: 0,
        pay: 50000,
        postedBefore:""
    });

 
      
    const updateJobType=function(jobTypeParam){
        setJobFilters({
            ...jobFilters,
            jobType: jobTypeParam
        });
    }

    const updatePostedDate=function(e){
        setJobFilters({
            ...jobFilters,
            postedBefore: e.target.value
        });
    }

    return (
        <div>
            <Navbar fixed="top" bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="#home">Find available jobs</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" style={{paddingLeft:"15vw"}}>
                        <Form inline>

                            <Col style={{minWidth:"12vw"}}>
                                <Form.Label className="mr-sm-4" style={{ color: "gray" }}>What kind of job?</Form.Label>
                                <NavDropdown title={jobFilters.jobType} id="basic-nav-dropdown" onSelect={updateJobType}>
                                    <NavDropdown.Item eventKey="Hospitalize">Hospitalize</NavDropdown.Item>
                                    <NavDropdown.Item eventKey="Mug">Mug</NavDropdown.Item>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item eventKey="Bounty reveal">Bounty reveal</NavDropdown.Item>
                                    <NavDropdown.Item eventKey="Bounty">Bounty</NavDropdown.Item>
                                </NavDropdown>
                            </Col>
                            
                            <Col>
                                <Form.Label className="mr-sm-4" style={{ color: "gray" }}>Posted After Date?</Form.Label>
                                <FormControl className="mr-sm-4" type="date" name='posted_after' value={jobFilters.postedBefore} onChange={updatePostedDate} />
                            </Col>

                            <Col>
                                <Form.Label className="mr-sm-4" style={{ color: "gray" }}>How many?</Form.Label>
                                <FormControl style={{ width: "5vw" }} max="99" value={jobFilters.amount} type="number" className="mr-sm-4" onChange={(e) => {
                                    setJobFilters({
                                        ...jobFilters,
                                        amount: e.target.value
                                    })
                                }} />
                            </Col>

                            <Col>
                                <Form.Label className="mr-sm-4" style={{ color: "gray" }}>Minimum Pay?</Form.Label>
                                <FormControl style={{ width: "8vw" }} max="100000000" step="10000"  value={jobFilters.pay} type="number" className="mr-sm-4" onChange={(e) => {
                                    setJobFilters({
                                        ...jobFilters,
                                        pay: e.target.value
                                    })
                                }} />
                            </Col>
                            <Button onClick={() => { dispatch(searchJobs(jobFilters)) }} variant="outline-success" >Find Jobs!</Button>
                        </Form>
                    </Nav>

                    <Nav style={{paddingLeft:"10vw"}}>
                        <Button onClick={() => { dispatch(searchJobs(jobFilters)) }} variant="outline-success" >Login/Register</Button>
                    </Nav>
                </Navbar.Collapse>

            </Navbar>

        </div>
    );

}