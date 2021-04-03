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
    const [filterRequestDTO, setFilterRequestDTO] = useState({})
    
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
        if(props.isOpen){
            console.log("opened advanced search with the template : "+JSON.stringify(props.jobDetailFilterTemplate)); 
        }
    },[props.isOpen])

    /* event handlers */

    const handleOnChangeFormElement = function (e) {
        var fieldName = e.target.name;
        var fieldValue = e.target.value;
        fieldValue=fieldValue.replaceAll('$', '');
        fieldValue=fieldValue.replaceAll(',', '');
        filterRequestDTO[fieldName] = fieldValue;
        setFilterRequestDTO({...filterRequestDTO});
    }

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
                    <Modal.Title>{props.jobDetailFilterTemplate==null?"":
                    <>
                    Search <span style={{color:"green"}}>{props.jobDetailFilterTemplate.filterTemplateLabel}</span> services with filters 
                    </>}</Modal.Title>
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
                                {props.jobDetailFilterTemplate == null ? "" : props.jobDetailFilterTemplate.filterElements.map((element => {
                                    if (element.serviceType === "ALL" || element.serviceType === serviceType) {
                                        return <Row style={{ paddingRight: "2vw", paddingLeft: "2vw", paddingTop: "1vh" }}>
                                            <Col><Form.Label className="mr-sm-4">{element.fieldLabel}</Form.Label></Col>
                                            <Col>
                                                {(element.format && element.format === CURRENCY_FORMAT) ?
                                                    <NumberFormat style={{ width: "10vw" }} name={element.fieldName} onChange={handleOnChangeFormElement}
                                                     className="mr-sm-4" thousandSeparator={true} prefix={'$'} /> :
                                                    <FormControl id={element.id}
                                                        style={{ width: "10vw" }} type={element.fieldType} min={0} name={element.fieldName}
                                                        size="sm" className="mr-sm-4" onChange={handleOnChangeFormElement} />}

                                            </Col>
                                        </Row>
                                    }
                                }))}
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