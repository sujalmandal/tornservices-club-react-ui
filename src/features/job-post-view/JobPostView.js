import React, { useEffect, useState } from "react";
import {
    Button,
    Col,
    Container,
    Dropdown,
    DropdownButton,
    Form,
    FormControl,
    Modal,
    Row,
    InputGroup
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CURRENCY_FORMAT, INPUT_TYPES, SERVICE_TYPE } from "../../constants";
import { allowOnlyNumbers, formatCurrency } from "../../utils/AppUtils";
import SpinnerText from "../common-components/SpinnerText";
import { selectAPIKey } from "../shared-vars/SharedStateSlice";
import {
    getAvailableJobDetailKeys,
    getJobDetailFormData,
    postNewJob,
} from "./JobPostViewSlice";

export function JobPostView() {
    const dispatch = useDispatch();

    const initialCreateJobDTO = {
        serviceType: SERVICE_TYPE.REQUEST.FORM.KEY,
        jobDetails: {},
        apiKey: useSelector(selectAPIKey),
    };

    const [templateName, setTemplateName] = useState(null);
    const [selectedServiceTypeObj, setServiceType] = useState(
        SERVICE_TYPE.REQUEST.FORM
    );
    const [
        availableJobDetailTemplates,
        setAvailableJobDetailTemplates,
    ] = useState([]);
    const [showJobPostForm, setShowJobPostForm] = useState(false);
    const [jobDetailsTemplate, setJobDetailsTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors,setFormErrors] = useState({});
    //form data
    const [createJobDTO, setCreateJobDTO] = useState(initialCreateJobDTO);

    /* side effects */
    useEffect(() => {
        setCreateJobDTO({
            ...createJobDTO,
            serviceType: selectedServiceTypeObj.KEY,
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
        } else {
            setTemplateName(availableJobDetailTemplates[0].label);
            setShowJobPostForm(true);
        }
    };

    const handleJobDetailTemplateSelect = function (index) {
        setCreateJobDTO({
            ...createJobDTO,
            serviceType: selectedServiceTypeObj.KEY,
            templateName:
                availableJobDetailTemplates[index].jobDetailFormTemplateName,
        });
        setTemplateName(
            availableJobDetailTemplates[index].jobDetailFormTemplateLabel
        );
        dispatch(
            getJobDetailFormData(
                availableJobDetailTemplates[index].jobDetailFormTemplateName,
                onGetJobDetailFormDataResult
            )
        );
    };

    const handleSelectServiceTypeChange = function (selectedServiceTypeKey) {
        setServiceType(SERVICE_TYPE[selectedServiceTypeKey].FORM);
    };

    const handleOnChangeFormElement = function (e) {
        var fieldName = e.target.name;
        var fieldValue = e.target.value;
        fieldValue = fieldValue.replaceAll("$", "");
        fieldValue = fieldValue.replaceAll(",", "");
        console.log("fieldName:" + fieldName + ", fieldValue:" + fieldValue);
        createJobDTO.jobDetails[fieldName] = fieldValue;
        setCreateJobDTO(createJobDTO);
    };

    const handlePostNewJob = function (e) {
        console.log("posting " + JSON.stringify(createJobDTO));
        setIsLoading(true);
        dispatch(postNewJob(createJobDTO, onPostResult));
    };

    /* callbacks */

    const onGetAvailableJobDetailKeysResult = function (isSuccess, response) {
        setIsLoading(false);
        console.log("getAvailableJobDetailKeys() result received!");
        if (isSuccess) {
            setAvailableJobDetailTemplates(response.data);
            setShowJobPostForm(true);
        } else {
            console.error(response);
            toast.error("Unable to available job type key details from server!");
        }
    };

    const onGetJobDetailFormDataResult = function (isSuccess, response) {
        console.log("getJobDetailFormData() result received!");
        if (isSuccess) {
            setJobDetailsTemplate(response.data);
        } else {
            console.error(response);
            toast.error("Unable to fetch job post details from server!");
        }
    };

    const onPostResult = function (isSuccess, result) {
        console.log("postNewJob() result received!");
        if (isSuccess) {
            toast.success(
                "Your job " +
                selectedServiceTypeObj.KEY.toLowerCase() +
                " has been posted!"
            );
            setJobDetailsTemplate(null);
            setCreateJobDTO(initialCreateJobDTO);
            setIsLoading(false);
            setShowJobPostForm(false);
        } else {
            setIsLoading(false);
            if (!result.response) {
                toast.error("unknown error occurred!");
            }
            var error = result.response.data;
            if (error) {
                toast.error("Error: " + error.message);
                setFormErrors(error.validationErrors);
                console.log(error.validationErrors);
            }
        }
    };

    const renderDynamicJobDetailFormBasedOnTemplate = function (
        jobDetailsTemplate,
        selectedServiceTypeObj
    ) {
        var renderedElements = [];
        if (jobDetailsTemplate != null) {
            jobDetailsTemplate.elements.forEach((element) => {
                if (
                    element.serviceType === "ALL" ||
                    element.serviceType === selectedServiceTypeObj.KEY
                ) {
                    if (element.type === INPUT_TYPES.NUMBER) {
                        if (element.format === CURRENCY_FORMAT) {
                            renderedElements.push(
                                <Form.Group>
                                    <Row
                                        key={"row_" + element.name}
                                        style={{
                                            paddingRight: "2vw",
                                            paddingLeft: "2vw",
                                            paddingTop: "1vh",
                                        }}
                                    >
                                        <Col>
                                            <Form.Label className="mr-sm-4">
                                                {element.label}
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <InputGroup className="mb-2">
                                                <InputGroup.Prepend>
                                                <InputGroup.Text>$</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl
                                                style={{ width: "10vw" }}
                                                id={element.id}
                                                min={element.minValue}
                                                max={element.maxValue}
                                                name={element.name}
                                                type="text"
                                                className="mr-sm-4"
                                                onKeyPress={allowOnlyNumbers}
                                                onChange={(e)=>{
                                                    formatCurrency(e,element.minValue,element.maxValue,handleOnChangeFormElement);
                                                }}
                                                isInvalid={formErrors[element.name]!=undefined}
                                            />
                                            {formErrors[element.name]!=undefined?
                                            <Form.Control.Feedback type="isInvalid" style={{color:"red"}}>
                                                {formErrors[element.name]?formErrors[element.name]:""}
                                            </Form.Control.Feedback>:""}
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            );
                        } else {
                            renderedElements.push(
                                <Form.Group>
                                    <Row
                                        key={"row_" + element.name}
                                        style={{
                                            paddingRight: "2vw",
                                            paddingLeft: "2vw",
                                            paddingTop: "1vh",
                                        }}
                                    >
                                        <Col>
                                            <Form.Label className="mr-sm-4">
                                                {element.label}
                                            </Form.Label>
                                        </Col>
                                        <Col>
                                            <FormControl
                                                id={element.id}
                                                style={{ width: "10vw" }}
                                                type="number"
                                                min={element.minValue}
                                                max={element.maxValue}
                                                name={element.name}
                                                size="sm"
                                                className="mr-sm-4"
                                                onChange={handleOnChangeFormElement}
                                                isInvalid={formErrors[element.name]!=undefined}
                                            />
                                            {formErrors[element.name]!=undefined?
                                            <Form.Control.Feedback type="isInvalid" style={{color:"red"}}>
                                                {formErrors[element.name]?formErrors[element.name]:""}
                                            </Form.Control.Feedback>:""}
                                        </Col>
                                    </Row>
                                </Form.Group>
                            );
                        }
                    } else if (element.type === INPUT_TYPES.CHECKBOX) {
                        renderedElements.push(
                            <Form.Group>
                                <Row
                                    key={"row_" + element.name}
                                    style={{
                                        paddingRight: "2vw",
                                        paddingLeft: "2vw",
                                        paddingTop: "1vh",
                                    }}
                                >
                                    <Col>
                                        <Form.Label className="mr-sm-4">{element.label}</Form.Label>
                                    </Col>
                                    <Col>
                                        <FormControl
                                            id={element.id}
                                            style={{ width: "10vw" }}
                                            type="checkbox"
                                            min={element.minValue}
                                            max={element.maxValue}
                                            name={element.name}
                                            defaultValue={element.defaultValue}
                                            size="sm"
                                            className="mr-sm-4"
                                            onChange={handleOnChangeFormElement}
                                            isInvalid={formErrors[element.name]!=undefined}
                                        />
                                        {formErrors[element.name]!=undefined?
                                            <Form.Control.Feedback type="isInvalid" style={{color:"red"}}>
                                                {formErrors[element.name]?formErrors[element.name]:""}
                                            </Form.Control.Feedback>:""}
                                    </Col>
                                </Row>
                            </Form.Group>
                        );
                    } else if (element.type === INPUT_TYPES.SELECT) {
                        renderedElements.push(
                            <Form.Group>
                                <Row
                                    key={"row_" + element.name}
                                    style={{
                                        paddingRight: "2vw",
                                        paddingLeft: "2vw",
                                        paddingTop: "1vh",
                                    }}
                                >
                                    <Col>
                                        <Form.Label>{element.label}</Form.Label>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            as="select"
                                            name={element.name}
                                            defaultValue={"--select--"}
                                            onChange={handleOnChangeFormElement}
                                            isInvalid={formErrors[element.name]!=undefined}
                                        >
                                            {element.options.map((option, index) => {
                                                return <option>{option}</option>;
                                            })}
                                        </Form.Control>
                                        {formErrors[element.name]!=undefined?
                                            <Form.Control.Feedback type="isInvalid" style={{color:"red"}}>
                                                {formErrors[element.name]?formErrors[element.name]:""}
                                            </Form.Control.Feedback>:""}
                                    </Col>
                                </Row>
                            </Form.Group>
                        );
                    }
                    //text type
                    else {
                        renderedElements.push(
                            <Form.Group>
                                <Row
                                    key={"row_" + element.name}
                                    style={{
                                        paddingRight: "2vw",
                                        paddingLeft: "2vw",
                                        paddingTop: "1vh",
                                    }}
                                >
                                    <Col>
                                        <Form.Label className="mr-sm-4">{element.label}</Form.Label>
                                    </Col>
                                    <Col>
                                        <FormControl
                                            id={element.id}
                                            style={{ width: "10vw" }}
                                            type="text"
                                            min={element.minValue}
                                            max={element.maxValue}
                                            name={element.name}
                                            defaultValue={element.defaultValue}
                                            size="sm"
                                            className="mr-sm-4"
                                            onChange={handleOnChangeFormElement}
                                            isInvalid={formErrors[element.name]!=undefined}
                                        />
                                        {formErrors[element.name]!=undefined?
                                            <Form.Control.Feedback type="isInvalid" style={{color:"red"}}>
                                                {formErrors[element.name]?formErrors[element.name]:""}
                                            </Form.Control.Feedback>:""}
                                    </Col>
                                </Row>
                            </Form.Group>
                        );
                    }
                }
            });
        }
        return renderedElements;
    };

    return (
        <div>
            <Button
                onClick={handleOpenJobPostForm}
                variant="outline-success"
                disabled={isLoading}
            >
                <SpinnerText
                    isLoading={isLoading}
                    loadingText="Just a min.."
                    text="Post Offer/Request"
                />
            </Button>
            <Modal
                size="lg"
                show={showJobPostForm}
                onHide={() => {
                    setShowJobPostForm(false);
                }}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Post a new Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <DropdownButton
                                    id="dropdown-basic-button-service-type"
                                    title={"I am " + selectedServiceTypeObj.LABEL}
                                    onSelect={handleSelectServiceTypeChange}
                                >
                                    <Dropdown.Item eventKey={SERVICE_TYPE.REQUEST.FORM.KEY}>
                                        {SERVICE_TYPE.REQUEST.FORM.LABEL}
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey={SERVICE_TYPE.OFFER.FORM.KEY}>
                                        {SERVICE_TYPE.OFFER.FORM.LABEL}
                                    </Dropdown.Item>
                                </DropdownButton>
                            </Col>
                            <Col>
                                <DropdownButton
                                    id="dropdown-basic-button-job-details"
                                    title={
                                        "Service : " + (templateName ? templateName : "-select-")
                                    }
                                    onSelect={handleJobDetailTemplateSelect}
                                >
                                    {availableJobDetailTemplates.map((formTemplate, index) => {
                                        return (
                                            <Dropdown.Item
                                                key={"Dropdown.Item_" + index}
                                                eventKey={index}
                                            >
                                                {formTemplate.jobDetailFormTemplateLabel}
                                            </Dropdown.Item>
                                        );
                                    })}
                                </DropdownButton>
                            </Col>
                        </Row>
                        <Row style={{ paddingTop: "5vh" }}>
                            <Container>
                                {renderDynamicJobDetailFormBasedOnTemplate(
                                    jobDetailsTemplate,
                                    selectedServiceTypeObj
                                )}
                            </Container>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={handlePostNewJob}
                        disabled={isLoading}
                    >
                        <SpinnerText
                            isLoading={isLoading}
                            loadingText="Working on it.."
                            text="Post!"
                        />
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={isLoading}
                        onClick={() => {
                            setShowJobPostForm(false);
                        }}
                    >
                        Cancel
          </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
