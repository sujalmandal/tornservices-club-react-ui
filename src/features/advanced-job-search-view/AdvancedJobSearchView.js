import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, Form, FormControl, Container, Dropdown, DropdownButton, Col, Row } from 'react-bootstrap';
import {
    postNewJob,
    getAvailableJobDetailKeys,
    getJobDetailFormData
} from './AvancedJobSearchViewSlice';
import {
    SERVICE_TYPE,
    CURRENCY_FORMAT
} from '../../constants';
import { selectAPIKey } from '../shared-vars/SharedStateSlice';
import NumberFormat from 'react-number-format';
import SpinnerText from '../common-components/SpinnerText';
import { toast } from 'react-toastify';

export function AdvancedJobSearchView(props) {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedServiceTypeObj, setServiceType] = useState(SERVICE_TYPE.REQUEST.FORM);
    const [filterRequestDTO, setFilterRequestDTO] = useState({})

    const handleSelectServiceTypeChange = function (selectedServiceTypeKey) {
        setServiceType(SERVICE_TYPE[selectedServiceTypeKey].FORM);
    }

    /* init */
    useEffect(() => {
        if (props.isOpen) {
            console.log("opening advanced search dialog --");
            console.log("selected template : " + JSON.stringify(props.jobDetailFilterTemplate))
            console.log("selected serviceType: "+selectedServiceTypeObj.KEY);
        }
    }, [props.isOpen])

    /* event handlers */

    const handleOnChangeFormElement = function (e) {
        var fieldName = e.target.name;
        var fieldValue = e.target.value;
        fieldValue = fieldValue.replaceAll('$', '');
        fieldValue = fieldValue.replaceAll(',', '');
        filterRequestDTO[fieldName] = fieldValue;
        setFilterRequestDTO({ ...filterRequestDTO });
    }

    const handleAdvancedSearch = function () {

    }

    const validateNumberFormat = function (valueObj, limit) {
        const value = valueObj.value;
        if (value >= 0 && value <= limit) {
            return valueObj;
        }
        return false;
    }

    /***** dynamic filter form renderer start *****/
    const renderDynamicFilter = function (jobDetailFilterTemplate,selectedServiceTypeKey) {
        console.log("rendering form based on template...");
        var renderedElements = [];
        var groupedElements = {};


        if (jobDetailFilterTemplate != null) {

            jobDetailFilterTemplate.filterElements.forEach((element) => {
                console.log(JSON.stringify(element))
                if(element.serviceType===SERVICE_TYPE.ALL || element.serviceType===selectedServiceTypeObj.KEY){
                    if (!groupedElements[element.groupName]){
                            groupedElements[element.groupName] = [];
                    }
                    groupedElements[element.groupName].push(element);
                }
            });

            for (const [groupName, elementArr] of Object.entries(groupedElements)) {
                /* text or checkbox */
                if (elementArr.length == 1) {
                    renderedElements.push(
                        <Row key={'row_'+groupName+"_"+elementArr[0].name}>
                            <Col>
                                <Form.Label className="mr-sm-4">{elementArr[0].fieldLabel}</Form.Label>
                                <FormControl id={elementArr[0].id} style={{ width: "10vw" }}
                                    type={elementArr[0].fieldType} name={elementArr[0].name}
                                    min={0} max={elementArr[0].limit}
                                    size="sm" className="mr-sm-4" onChange={handleOnChangeFormElement} 
                                />
                            </Col>
                        </Row>
                    );
                }
                /* number (min & max) */
                if (elementArr.length === 2 && elementArr[0].fieldType === "number" && elementArr[1].fieldType === "number") {
                    if (elementArr[0].format === CURRENCY_FORMAT && elementArr[1].format === CURRENCY_FORMAT) {
                        renderedElements.push(
                            <Row key={'row_'+groupName+"_"+elementArr[0].name}>
                                <Col>
                                    <Form.Label className="mr-sm-4">{elementArr[0].fieldLabel}</Form.Label>
                                    <NumberFormat style={{ width: "10vw" }} name={elementArr[0].name} onChange={handleOnChangeFormElement}
                                        className=".mr-sm-4 form-control form-control-sm" thousandSeparator={true} prefix={'$'}
                                        isAllowed={(valObj) => { return validateNumberFormat(valObj, elementArr[0].limit) }} 
                                    />
                                </Col>
                                <Col>
                                    <Form.Label className="mr-sm-4">{elementArr[1].fieldLabel}</Form.Label>
                                    <NumberFormat className=".form-control-sm" style={{ width: "10vw" }} name={elementArr[1].name} onChange={handleOnChangeFormElement}
                                        className=".mr-sm-4 form-control form-control-sm" thousandSeparator={true} prefix={'$'}
                                        isAllowed={(valObj) => { return validateNumberFormat(valObj, elementArr[0].limit) }} 
                                    />
                                </Col>
                            </Row>);
                    }
                    else {
                        renderedElements.push(
                            <Row key={'row_'+groupName+"_"+elementArr[0].name}>
                                <Col>
                                    <Form.Label className="mr-sm-4">{elementArr[0].fieldLabel}</Form.Label>
                                    <FormControl id={elementArr[0].id}
                                        style={{ width: "10vw" }} min={0} type="number" max={elementArr[0].limit} name={elementArr[0].name}
                                        size="sm" className="mr-sm-4" onChange={handleOnChangeFormElement} 
                                    />
                                </Col>
                                <Col>
                                    <Form.Label className="mr-sm-4">{elementArr[1].fieldLabel}</Form.Label>
                                    <FormControl id={elementArr[1].id}
                                        style={{ width: "10vw" }} min={0} type="number" max={elementArr[1].limit} name={elementArr[1].name}
                                        size="sm" className="mr-sm-4" onChange={handleOnChangeFormElement}
                                    />
                                </Col>
                            </Row>);
                    }
                }

            }
        }
        return renderedElements;
    }

    /***** dynamic filter form renderer end *****/

    return (
        <div>
            <Modal
                size="lg"
                show={props.isOpen}
                onHide={() => { props.onClose() }}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{props.jobDetailFilterTemplate == null ? "" :
                        <>
                            Search <span style={{ color: "green" }}>{props.jobDetailFilterTemplate.filterTemplateLabel}</span> services with filters
                    </>}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                            <DropdownButton id="dropdown-basic-button-service-type" title={"I am " + selectedServiceTypeObj.LABEL} onSelect={handleSelectServiceTypeChange}>
                                    <Dropdown.Item eventKey={SERVICE_TYPE.REQUEST.FORM.KEY}>{SERVICE_TYPE.REQUEST.FORM.LABEL}</Dropdown.Item>
                                    <Dropdown.Item eventKey={SERVICE_TYPE.OFFER.FORM.KEY}>{SERVICE_TYPE.OFFER.FORM.LABEL}</Dropdown.Item>
                                </DropdownButton>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: "2vh" }}>
                            <Form inline>
                                <Container style={{ paddingLeft: "2vw" }}>
                                    <Row>
                                        <Form.Text className="text-muted">
                                            <span style={{ color: "gray" }}>Please fill the items you want. You can leave the ones you don't want empty.</span>
                                        </Form.Text>
                                    </Row>
                                    <Row style={{ paddingTop: "0.5vw" }}>
                                        {props.isOpen?renderDynamicFilter(props.jobDetailFilterTemplate,selectedServiceTypeObj.KEY):""}
                                    </Row>
                                </Container>
                            </Form>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAdvancedSearch} disabled={isLoading}>
                        <SpinnerText isLoading={isLoading} loadingText="Working on it.." text="Advanced Search" />
                    </Button>
                    <Button variant="secondary" disabled={isLoading} onClick={() => { props.onClose() }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}