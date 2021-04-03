import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form, FormControl, Container, Dropdown, DropdownButton, Col, Row } from 'react-bootstrap';
import {
    postNewJob,
    getAvailableJobDetailKeys,
    getJobDetailFormData
} from './AvancedJobSearchViewSlice';
import {
    SERVICE_TYPE_REQUESTING_FILTER_LABEL,
    SERVICE_TYPE_OFFERING_FILTER_LABEL,
    SERVICE_TYPE_OFFER,
    SERVICE_TYPE_REQUEST,
    CURRENCY_FORMAT
} from '../../constants';
import { selectAPIKey } from '../shared-vars/SharedStateSlice';
import NumberFormat from 'react-number-format';
import SpinnerText from '../common-components/SpinnerText';
import { toast } from 'react-toastify';

export function AdvancedJobSearchView(props) {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [serviceTypeText, setServiceTypeText] = useState(SERVICE_TYPE_OFFERING_FILTER_LABEL);
    const [serviceType, setServiceType] = useState(SERVICE_TYPE_REQUEST);
    
    const handleServiceTypeTextChange = function (serviceTypeText) {
        setServiceTypeText(serviceTypeText);
        if (serviceTypeText === SERVICE_TYPE_REQUESTING_FILTER_LABEL) {
            setServiceType(SERVICE_TYPE_REQUEST);
        }
        if (serviceTypeText === SERVICE_TYPE_OFFERING_FILTER_LABEL) {
            setServiceType(SERVICE_TYPE_OFFER);
        }
    }


    /* init */
    useEffect(()=>{
        console.log("opened advanced search with the template : "+JSON.stringify(props.jobDetailFilterTemplate));
    },[])

    const handleAdvancedSearch=function(){

    }

    return (
        <div>
            <Modal
                size="lg"
                show={props.isOpen}
                onHide={() => { props.onClose() }}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Search with filters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <DropdownButton id="dropdown-basic-button-service-type" title={serviceTypeText} onSelect={handleServiceTypeTextChange}>
                                    <Dropdown.Item eventKey={SERVICE_TYPE_OFFERING_FILTER_LABEL}>{SERVICE_TYPE_OFFERING_FILTER_LABEL}</Dropdown.Item>
                                    <Dropdown.Item eventKey={SERVICE_TYPE_REQUESTING_FILTER_LABEL}>{SERVICE_TYPE_REQUESTING_FILTER_LABEL}</Dropdown.Item>
                                </DropdownButton>
                            </Col>
                          
                        </Row>
                        <Row style={{ paddingTop: "5vh" }}>
                            <Container>
                               
                            </Container>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAdvancedSearch} disabled={isLoading}>
                        <SpinnerText isLoading={isLoading} loadingText="Working on it.." text="Advanced Search"/>
                    </Button>
                    <Button variant="secondary" disabled={isLoading} onClick={() => { props.onClose() }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}