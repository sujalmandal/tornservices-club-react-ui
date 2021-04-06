import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form, FormControl, Container, Dropdown, DropdownButton, Col, Row } from 'react-bootstrap';
import {
    postNewJob,
    getAvailableJobDetailKeys,
    getJobDetailFormData
} from './JobPostViewSlice';
import {
    SERVICE_TYPE,
    CURRENCY_FORMAT,
    INPUT_TYPES
} from '../../constants';
import { selectAPIKey } from '../shared-vars/SharedStateSlice';
import NumberFormat from 'react-number-format';
import SpinnerText from '../common-components/SpinnerText';
import { validateNumberFormat } from '../../utils/AppUtils';
import { toast } from 'react-toastify';

export function JobPostView() {

    const dispatch = useDispatch();

    const initialCreateJobDTO = {
        serviceType: SERVICE_TYPE.REQUEST.FORM.KEY,
        jobDetails: {},
        apiKey: useSelector(selectAPIKey)
    };

    const [templateName, setTemplateName] = useState(null);
    const [selectedServiceTypeObj, setServiceType] = useState(SERVICE_TYPE.REQUEST.FORM);
    const [availableJobDetailTemplates, setAvailableJobDetailTemplates] = useState([]);
    const [showJobPostForm, setShowJobPostForm] = useState(false);
    const [jobDetailsTemplate, setJobDetailsTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    //form data
    const [createJobDTO, setCreateJobDTO] = useState(initialCreateJobDTO);

    /* side effects */
    useEffect(() => {
        setCreateJobDTO({
            ...createJobDTO,
            serviceType: selectedServiceTypeObj.KEY
        });
    }, [selectedServiceTypeObj]);

    /* handlers */
    const handleOpenJobPostForm = function () {
        setCreateJobDTO(initialCreateJobDTO);
        setJobDetailsTemplate(null);
        if (availableJobDetailTemplates.length === 0) {
            setIsLoading(true);
            console.log("getAvailableJobDetailKeys() triggered!");
            dispatch(getAvailableJobDetailKeys(onGetAvailableJobDetailKeysResult));
        }
        else {
            setTemplateName(availableJobDetailTemplates[0].label);
            setShowJobPostForm(true);
        }
    }

    const handleJobDetailTemplateSelect = function (index) {
        setCreateJobDTO({
            ...createJobDTO,
            serviceType: selectedServiceTypeObj.KEY,
            templateName: availableJobDetailTemplates[index].jobDetailFormTemplateName
        });
        setTemplateName(availableJobDetailTemplates[index].jobDetailFormTemplateLabel);
        dispatch(getJobDetailFormData(availableJobDetailTemplates[index].jobDetailFormTemplateName, onGetJobDetailFormDataResult));
    }

    const handleSelectServiceTypeChange = function (selectedServiceTypeKey) {
        setServiceType(SERVICE_TYPE[selectedServiceTypeKey].FORM);
    }

    const handleOnChangeFormElement = function (e) {
        var fieldName = e.target.name;
        var fieldValue = e.target.value;
        fieldValue = fieldValue.replaceAll('$', '');
        fieldValue = fieldValue.replaceAll(',', '');
        console.log("fieldName:"+fieldName+", fieldValue:"+fieldValue);
        createJobDTO.jobDetails[fieldName] = fieldValue;
        setCreateJobDTO(createJobDTO);
    }

    const handlePostNewJob = function (e) {
        console.log("posting " + JSON.stringify(createJobDTO));
        setIsLoading(true);
        dispatch(postNewJob(createJobDTO, onPostResult));
    }

    /* callbacks */

    const onGetAvailableJobDetailKeysResult = function (isSuccess, response) {
        setIsLoading(false);
        console.log("getAvailableJobDetailKeys() result received!");
        if (isSuccess) {
            setAvailableJobDetailTemplates(response.data);
            setShowJobPostForm(true);
        }
        else {
            console.error(response);
            toast.error("Unable to available job type key details from server!");
        }
    }

    const onGetJobDetailFormDataResult = function (isSuccess, response) {
        console.log("getJobDetailFormData() result received!");
        if (isSuccess) {
            setJobDetailsTemplate(response.data);
        }
        else {
            console.error(response);
            toast.error("Unable to fetch job post details from server!");
        }
    }

    const onPostResult = function (isSuccess, response) {
        setCreateJobDTO(initialCreateJobDTO);
        setJobDetailsTemplate(null);
        console.log("postNewJob() result received!");
        if (isSuccess) {
            toast.success("Your job " + selectedServiceTypeObj.KEY.toLowerCase() + " has been posted!");
            setIsLoading(false);
            setShowJobPostForm(false);
        }
        else {
            setIsLoading(false);
            console.error("error: "+response);
            toast.error("Unable to post the job! :( please contact transhumanist on torn!");
        }
    }

    const renderDynamicJobDetailFormBasedOnTemplate = function (jobDetailsTemplate, selectedServiceTypeObj) {
        var renderedElements = [];
        if (jobDetailsTemplate != null) {
            jobDetailsTemplate.elements.forEach(element => {
                if (element.serviceType === "ALL" || element.serviceType === selectedServiceTypeObj.KEY) {
                    if (element.type == INPUT_TYPES.NUMBER) {
                        if (element.format === CURRENCY_FORMAT) {
                            renderedElements.push(<Row key={'row_' + element.name} style={{ paddingRight: "2vw", paddingLeft: "2vw", paddingTop: "1vh" }}>
                                <Col><Form.Label className="mr-sm-4">{element.label}</Form.Label></Col>
                                <Col>
                                    <NumberFormat style={{ width: "10vw" }} name={element.name} onChange={handleOnChangeFormElement}
                                        className=".mr-sm-4 form-control form-control-sm" thousandSeparator={true} prefix={'$'}
                                        isAllowed={(valObj) => { return validateNumberFormat(valObj, element.maxValue,element.minValue) }}
                                        defaultValue={element.defaultValue} />
                                </Col></Row>);
                        }
                        else {
                            renderedElements.push(<Row key={'row_' + element.name} style={{ paddingRight: "2vw", paddingLeft: "2vw", paddingTop: "1vh" }}>
                                <Col><Form.Label className="mr-sm-4">{element.label}</Form.Label></Col>
                                <Col>
                                    <FormControl id={element.id}
                                        style={{ width: "10vw" }} type="number" min={element.minValue}
                                        max={element.maxValue} name={element.name} defaultValue={element.defaultValue}
                                        size="sm" className="mr-sm-4" onChange={handleOnChangeFormElement} />
                                </Col></Row>);
                        }
                    }
                    else if (element.type === INPUT_TYPES.CHECKBOX) {
                        renderedElements.push(<Row key={'row_' + element.name} style={{ paddingRight: "2vw", paddingLeft: "2vw", paddingTop: "1vh" }}>
                            <Col><Form.Label className="mr-sm-4">{element.label}</Form.Label></Col>
                            <Col>
                                <FormControl id={element.id}
                                    style={{ width: "10vw" }} type="checkbox" min={element.minValue}
                                    max={element.maxValue} name={element.name} defaultValue={element.defaultValue}
                                    size="sm" className="mr-sm-4" onChange={handleOnChangeFormElement} />
                            </Col></Row>);
                    }
                    else if (element.type === INPUT_TYPES.SELECT) {
                        renderedElements.push(<Row key={'row_' + element.name} style={{ paddingRight: "2vw", paddingLeft: "2vw", paddingTop: "1vh" }}>
                            <Col><Form.Label>{element.label}</Form.Label></Col>
                            <Col><Form.Control as="select" name={element.name} defaultValue={element.defaultValue} 
                                    onChange={handleOnChangeFormElement}>
                                {element.options.map((option,index)=>{
                                    return <option>{option}</option>;
                                })}
                            </Form.Control></Col>
                        </Row>);
                    }
                    else {
                        renderedElements.push(<Row key={'row_' + element.name} style={{ paddingRight: "2vw", paddingLeft: "2vw", paddingTop: "1vh" }}>
                            <Col><Form.Label className="mr-sm-4">{element.label}</Form.Label></Col>
                            <Col>
                                <FormControl id={element.id}
                                    style={{ width: "10vw" }} type="text" min={element.minValue}
                                    max={element.maxValue} name={element.name} defaultValue={element.defaultValue}
                                    size="sm" className="mr-sm-4" onChange={handleOnChangeFormElement} />
                            </Col></Row>);
                    }
                }
            });
        }
        return renderedElements;
    }

    return (
        <div>
            <Button onClick={handleOpenJobPostForm} variant="outline-success" disabled={isLoading}>
                <SpinnerText isLoading={isLoading} loadingText="Just a min.." text="Post Offer/Request" />
            </Button>
            <Modal
                size="lg"
                show={showJobPostForm}
                onHide={() => { setShowJobPostForm(false) }}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Post a new Job</Modal.Title>
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
                            <Col>
                                <DropdownButton id="dropdown-basic-button-job-details" title={"Service : " + (templateName ? templateName : "-select-")} onSelect={handleJobDetailTemplateSelect}>
                                    {availableJobDetailTemplates.map((formTemplate, index) => {
                                        return <Dropdown.Item key={'Dropdown.Item_' + index} eventKey={index}>{formTemplate.jobDetailFormTemplateLabel}</Dropdown.Item>
                                    })}
                                </DropdownButton>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: "5vh" }}>
                            <Container>
                                {renderDynamicJobDetailFormBasedOnTemplate(jobDetailsTemplate, selectedServiceTypeObj)}
                            </Container>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePostNewJob} disabled={isLoading}>
                        <SpinnerText isLoading={isLoading} loadingText="Working on it.." text="Post!" />
                    </Button>
                    <Button variant="secondary" disabled={isLoading} onClick={() => { setShowJobPostForm(false) }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}