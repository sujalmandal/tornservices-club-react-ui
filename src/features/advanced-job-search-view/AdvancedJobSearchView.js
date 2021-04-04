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
    useEffect(() => {
        if (props.isOpen) {
            console.log("opened advanced search with the template : " + JSON.stringify(props.jobDetailFilterTemplate));
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

    const renderDynamicFilter = function (jobDetailFilterTemplate) {
        console.log("rendering form based on template...");
        var renderedElements = [];
        var groupedElements = {};


        if (jobDetailFilterTemplate != null) {

            jobDetailFilterTemplate.filterElements.forEach((element) => {
                if (!groupedElements[element.groupName])
                    groupedElements[element.groupName] = [];
                groupedElements[element.groupName].push(element);
            });

            for (const [groupName, elementArr] of Object.entries(groupedElements)) {
                /* text or checkbox */
                if (elementArr.length == 1) {
                    renderedElements.push(
                        <Row>
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
                            <Row>
                                <Col>
                                    <Form.Label className="mr-sm-4">{elementArr[0].fieldLabel}</Form.Label>
                                    <NumberFormat style={{ width: "10vw" }} name={elementArr[0].name} onChange={handleOnChangeFormElement}
                                        className="mr-sm-4" thousandSeparator={true} prefix={'$'}
                                        isAllowed={(valObj) => { return validateNumberFormat(valObj, elementArr[0].limit) }} 
                                    />
                                </Col>
                                <Col>
                                    <Form.Label className="mr-sm-4">{elementArr[1].fieldLabel}</Form.Label>
                                    <NumberFormat style={{ width: "10vw" }} name={elementArr[1].name} onChange={handleOnChangeFormElement}
                                        className="mr-sm-4" thousandSeparator={true} prefix={'$'}
                                        isAllowed={(valObj) => { return validateNumberFormat(valObj, elementArr[0].limit) }} 
                                    />
                                </Col>
                            </Row>);
                    }
                    else {
                        renderedElements.push(
                            <Row>
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
                                <DropdownButton id="dropdown-basic-button-service-type" title={serviceTypeText} onSelect={handleServiceTypeTextChange}>
                                    <Dropdown.Item eventKey={SERVICE_TYPE_OFFERING_FILTER_LABEL}>{SERVICE_TYPE_OFFERING_FILTER_LABEL}</Dropdown.Item>
                                    <Dropdown.Item eventKey={SERVICE_TYPE_REQUESTING_FILTER_LABEL}>{SERVICE_TYPE_REQUESTING_FILTER_LABEL}</Dropdown.Item>
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
                                        {renderDynamicFilter(props.jobDetailFilterTemplate)}
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