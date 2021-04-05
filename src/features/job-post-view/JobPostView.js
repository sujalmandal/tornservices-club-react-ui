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
    CURRENCY_FORMAT
} from '../../constants';
import { selectAPIKey } from '../shared-vars/SharedStateSlice';
import NumberFormat from 'react-number-format';
import SpinnerText from '../common-components/SpinnerText';
import {validateNumberFormat} from '../../utils/AppUtils';
import { toast } from 'react-toastify';

export function JobPostView() {

    const dispatch = useDispatch();

    const initialCreateJobDTO = {
        serviceType: SERVICE_TYPE.REQUEST.FORM.KEY,
        jobDetails: {},
        apiKey: useSelector(selectAPIKey)
    };

    const [jobType, setJobType] = useState(null);
    const [selectedServiceTypeObj, setServiceType] = useState(SERVICE_TYPE.REQUEST.FORM);
    const [availableJobDetailTemplates, setAvailableJobDetailTemplates] = useState([]);
    const [showJobPostForm, setShowJobPostForm] = useState(false);
    const [jobDetailsTemplate, setJobDetailsTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    //form data
    const [createJobDTO, setCreateJobDTO] = useState(initialCreateJobDTO);

    /* side effects */
    useEffect(()=>{
        setCreateJobDTO({
            ...createJobDTO,
            serviceType: selectedServiceTypeObj.KEY
        });
    },[selectedServiceTypeObj]);

    /* handlers */
    const handleOpenJobPost = function () {
        if (availableJobDetailTemplates.length === 0) {
            setIsLoading(true);
            console.log("getAvailableJobDetailKeys() triggered!");
            dispatch(getAvailableJobDetailKeys(onGetAvailableJobDetailKeysResult));
        }
        else {
            setJobType(availableJobDetailTemplates[0].label);
            setShowJobPostForm(true);
        }
    }

    const handleJobTypeSelect = function (index) {
        setCreateJobDTO({
            ...createJobDTO,
            serviceType: selectedServiceTypeObj.KEY,
            jobDetailType: availableJobDetailTemplates[index].jobDetailFormTemplateName
        });
        setJobType(availableJobDetailTemplates[index].jobDetailFormTemplateLabel);
        dispatch(getJobDetailFormData(availableJobDetailTemplates[index].jobDetailFormTemplateName, onGetJobDetailFormDataResult));
    }

    const handleSelectServiceTypeChange = function (selectedServiceTypeKey) {
        setServiceType(SERVICE_TYPE[selectedServiceTypeKey].FORM);
    }

    const handleOnChangeFormElement = function (e) {
        var fieldName = e.target.name;
        var fieldValue = e.target.value;
        fieldValue=fieldValue.replaceAll('$', '');
        fieldValue=fieldValue.replaceAll(',', '');
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
        console.log("postNewJob() result received!");
        if (isSuccess) {
            toast.success("Your job " + selectedServiceTypeObj.KEY.toLowerCase() + " has been posted!");
            setIsLoading(false);
            setShowJobPostForm(false);
            setCreateJobDTO(initialCreateJobDTO);
        }
        else {
            setIsLoading(false);
            console.error(response);
            toast.error("Unable to post the job! :( please contact transhumanist on torn!");
        }
    }

    return (
        <div>
            <Button onClick={handleOpenJobPost} variant="outline-success" disabled={isLoading}>
                <SpinnerText isLoading={isLoading} loadingText="Just a min.." text="Post New Job"/>
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
                                <DropdownButton id="dropdown-basic-button-job-details" title={"Service : " + (jobType ? jobType : "-select-")} onSelect={handleJobTypeSelect}>
                                    {availableJobDetailTemplates.map((formTemplate, index) =>{
                                        return <Dropdown.Item key={'Dropdown.Item_'+index} eventKey={index}>{formTemplate.jobDetailFormTemplateLabel}</Dropdown.Item>
                                    })}
                                </DropdownButton>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: "5vh" }}>
                            <Container>
                                {jobDetailsTemplate == null ? "" : jobDetailsTemplate.elements.map((element => {
                                    if (element.serviceType === "ALL" || element.serviceType === selectedServiceTypeObj.KEY) {
                                        return <Row key={'row_'+element.name} style={{ paddingRight: "2vw", paddingLeft: "2vw", paddingTop: "1vh" }}>
                                            <Col><Form.Label className="mr-sm-4">{element.label}</Form.Label></Col>
                                            <Col>
                                                {(element.format && element.format === CURRENCY_FORMAT) ?
                                                    <NumberFormat style={{ width: "10vw" }} name={element.name} onChange={handleOnChangeFormElement}
                                                     className=".mr-sm-4 form-control form-control-sm" thousandSeparator={true} prefix={'$'} 
                                                     isAllowed={(valObj) => { return validateNumberFormat(valObj, element.maxValue) }} 
                                                     defaultValue={element.defaultValue} /> 
                                                     :
                                                    <FormControl id={element.id}
                                                        style={{ width: "10vw" }} type={element.type} min={element.minValue} 
                                                        max={element.maxValue} name={element.name} defaultValue={element.defaultValue}
                                                        size="sm" className="mr-sm-4" onChange={handleOnChangeFormElement} />
                                                }
                                            </Col>
                                        </Row>
                                    }
                                }))}
                            </Container>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePostNewJob} disabled={isLoading}>
                        <SpinnerText isLoading={isLoading} loadingText="Working on it.." text="Post!"/>
                    </Button>
                    <Button variant="secondary" disabled={isLoading} onClick={() => { setShowJobPostForm(false) }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}