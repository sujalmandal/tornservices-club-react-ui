import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal, Form, FormControl, Container, Dropdown, DropdownButton, Col, Row } from 'react-bootstrap';
import {
    postNewJob,
    getAvailableJobDetailKeys,
    getJobDetailFormData
} from './JobPostViewSlice';
import {
    SERVICE_TYPE_OFFERING_TEXT,
    SERVICE_TYPE_REQUESTING_TEXT,
    SERVICE_TYPE_OFFERING,
    SERVICE_TYPE_REQUESTING
} from '../../constants';
import { toast } from 'react-toastify';

export function JobPostView() {

    const dispatch = useDispatch();

    const [jobType, setJobType] = useState(null);
    const [serviceTypeText, setServiceTypeText] = useState(SERVICE_TYPE_REQUESTING_TEXT);
    const [serviceType, setServiceType] = useState(SERVICE_TYPE_REQUESTING);
    const [availableKeys, setAvailableKeys] = useState([]);
    const [showJobPostForm, setShowJobPostForm] = useState(false);
    const [formData, setFormData] = useState(null);
    const [createJobDTO, setCreateJobDTO] = useState({

    });

    /* handlers */
    const handleOpenJobPost = function () {
        if (availableKeys.length === 0) {
            console.log("getAvailableJobDetailKeys() triggered!");
            dispatch(getAvailableJobDetailKeys(onGetAvailableJobDetailKeysResult));
        }
        else {
            setJobType(availableKeys[0].label);
            setShowJobPostForm(true);
        }
    }

    const handleJobTypeSelect = function (index) {
        setJobType(availableKeys[index].label);
        dispatch(getJobDetailFormData(availableKeys[index].key, onGetJobDetailFormDataResult));
    }

    const handleServiceTypeTextChange=function(serviceTypeText){
        setServiceTypeText(serviceTypeText);
        if(serviceTypeText===SERVICE_TYPE_REQUESTING_TEXT){
            setServiceType(SERVICE_TYPE_REQUESTING);
        }
        if(serviceTypeText===SERVICE_TYPE_OFFERING_TEXT){
            setServiceType(SERVICE_TYPE_OFFERING);
        }
    }


    /* callbacks */

    const onGetAvailableJobDetailKeysResult = function (isSuccess, response) {
        console.log("getAvailableJobDetailKeys() result received!");
        if (isSuccess) {
            setAvailableKeys(response.data);
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
            console.log(response.data);
            setFormData(response.data);
        }
        else {
            console.error(response);
            toast.error("Unable to fetch job post details from server!");
        }
    }

    return (
        <div>
            <Button onClick={handleOpenJobPost} variant="outline-success" >Post a new job</Button>
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
                                <DropdownButton id="dropdown-basic-button-service-type" title={"I am " + serviceTypeText} onSelect={handleServiceTypeTextChange}>
                                    <Dropdown.Item eventKey={SERVICE_TYPE_OFFERING_TEXT}>{SERVICE_TYPE_OFFERING_TEXT}</Dropdown.Item>
                                    <Dropdown.Item eventKey={SERVICE_TYPE_REQUESTING_TEXT}>{SERVICE_TYPE_REQUESTING_TEXT}</Dropdown.Item>
                                </DropdownButton>
                            </Col>
                            <Col>
                                <DropdownButton id="dropdown-basic-button-job-details" title={"Service : " + (jobType ? jobType : "-select-")} onSelect={handleJobTypeSelect}>
                                    {availableKeys.map((jobDetailType,index) => {
                                        return <Dropdown.Item eventKey={index}>{jobDetailType.label}</Dropdown.Item>
                                    })}
                                </DropdownButton>
                            </Col>
                        </Row>
                        <Row style={{paddingTop:"5vh"}}>
                            <Container>
                                <Form>
                                    {formData == null ? "" : formData.elements.map((element => {
                                        if(element.serviceType==="ALL" || element.serviceType===serviceType){
                                            return <Row style={{paddingRight:"2vw", paddingLeft:"2vw", paddingTop:"1vh"}}>
                                            <Col><Form.Label className="mr-sm-4">{element.label}</Form.Label></Col>
                                            <Col><FormControl id={element.id} style={{ width: "10vw" }} type={element.type} min={0} size="sm" className="mr-sm-4" /></Col>
                                        </Row> 
                                        }
                                    }))}
                                </Form>
                            </Container>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowJobPostForm(false) }}>Cancel</Button>
                    <Button variant="primary" onClick={() => (dispatch(postNewJob(createJobDTO)))}>Post!</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}