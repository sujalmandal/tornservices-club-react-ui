import React, { useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
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
import { selectAPIKey } from '../shared-vars/SharedStateSlice';
import { toast } from 'react-toastify';

export function JobPostView() {

    const dispatch = useDispatch();

    const [jobType, setJobType] = useState(null);
    const [serviceTypeText, setServiceTypeText] = useState(SERVICE_TYPE_REQUESTING_TEXT);
    const [serviceType, setServiceType] = useState(SERVICE_TYPE_REQUESTING);
    const [availableKeys, setAvailableKeys] = useState([]);
    const [showJobPostForm, setShowJobPostForm] = useState(false);
    const [jobDetailsTemplate,setJobDetailsTemplate] = useState(null);

    //form data
    const [createJobDTO, setCreateJobDTO] = useState({
        serviceType:SERVICE_TYPE_REQUESTING,
        jobDetails:{

        },
        apiKey: useSelector(selectAPIKey)
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
            setCreateJobDTO({
                ...createJobDTO,
                serviceType:SERVICE_TYPE_REQUESTING
            });
        }
        if(serviceTypeText===SERVICE_TYPE_OFFERING_TEXT){
            setServiceType(SERVICE_TYPE_OFFERING);
            setCreateJobDTO({
                ...createJobDTO,
                serviceType:SERVICE_TYPE_OFFERING
            });
        }
    }

    const handleOnChangeFormElement=function(e){
        var fieldName=e.target.name;
        var fieldValue=e.target.value;
        createJobDTO.jobDetails[fieldName]=fieldValue;
        setCreateJobDTO(createJobDTO);
    }

    const handlePostNewJob = function(e){
        dispatch(postNewJob(createJobDTO,onPostResult));
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
            setJobDetailsTemplate(response.data);
        }
        else {
            console.error(response);
            toast.error("Unable to fetch job post details from server!");
        }
    }

    const onPostResult=function(isSuccess, response){
        console.log("postNewJob() result received!");
        if (isSuccess) {
            console.log(response.data);
        }
        else {
            console.error(response);
            toast.error("Unable to post the job :( !");
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
                               
                                    {jobDetailsTemplate == null ? "" : jobDetailsTemplate.elements.map((element => {
                                        if(element.serviceType==="ALL" || element.serviceType===serviceType){
                                            return <Row style={{paddingRight:"2vw", paddingLeft:"2vw", paddingTop:"1vh"}}>
                                            <Col><Form.Label className="mr-sm-4">{element.label}</Form.Label></Col>
                                            <Col><FormControl id={element.id} 
                                                    style={{ width: "10vw" }} type={element.type} min={0} name={element.name}
                                                    size="sm" className="mr-sm-4" onChange={handleOnChangeFormElement}/></Col>
                                        </Row> 
                                        }
                                    }))}
                            </Container>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handlePostNewJob}>Post!</Button>
                    <Button variant="secondary" onClick={() => { setShowJobPostForm(false) }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}