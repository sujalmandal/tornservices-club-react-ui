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
import { CURRENCY_FORMAT, INPUT_TYPES, SERVICE_TYPE, JOB_CREATE_LABEL } from "../../constants";
import { allowOnlyNumbers, formatCurrency, fieldHasError, getFieldErrorMessage } from "../../utils/AppUtils";
import SpinnerText from "../common-components/SpinnerText";
import { selectAPIKey,selectIsLoggedIn } from "../shared-vars/SharedStateSlice";
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
    const isLoggedIn_ReduxState = useSelector(selectIsLoggedIn);

    const [selectedTemplateName, setSelectedTemplateName] = useState(null);
    const [selectedTemplateLabel, setSelectedTemplateLabel] = useState("--select--");
    const [selectedServiceTypeObj, setSelectedServiceTypeObj] = useState(
        SERVICE_TYPE.REQUEST.FORM
    );
    const [
        availableJobDetailTemplates,
        setAvailableJobDetailTemplates,
    ] = useState([]);
    const [showJobPostForm, setShowJobPostForm] = useState(false);
    const [selectedJobDetailTemplateObj, setSelectedJobDetailTemplateObj] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formLabel, setFormLabel] = useState(null);
    //form data
    const [createJobDTO, setCreateJobDTO] = useState(initialCreateJobDTO);

    /* side effects */
    useEffect(() => {
        setCreateJobDTO({
            ...createJobDTO,
            serviceType: selectedServiceTypeObj.KEY,
        });
    }, [selectedServiceTypeObj]);

    useEffect(() => {
        setFormErrors({});
        if (selectedJobDetailTemplateObj) {
            if (selectedServiceTypeObj.KEY === SERVICE_TYPE.REQUEST.FORM.KEY) {
                setFormLabel(selectedJobDetailTemplateObj.formRequestTypeLabel);
            }
            else if (selectedServiceTypeObj.KEY === SERVICE_TYPE.OFFER.FORM.KEY) {
                setFormLabel(selectedJobDetailTemplateObj.formOfferTypeLabel);
            }
        }
        else {
            setFormLabel("--select--");
        }
    }, [selectedServiceTypeObj, selectedJobDetailTemplateObj]);

    /* handlers */
    const handleOpenJobPostForm = function () {
        if(isLoggedIn_ReduxState){
            setCreateJobDTO(initialCreateJobDTO);
            setSelectedJobDetailTemplateObj(null);
            if (availableJobDetailTemplates.length === 0) {
                setIsLoading(true);
                console.log("getAvailableJobDetailKeys() triggered!");
                dispatch(getAvailableJobDetailKeys(onGetAvailableJobDetailKeysResult));
            } else {
                setShowJobPostForm(true);
            }
        }
        else{
            toast.error("Please login to create your own posts.");
        }
    };

    const handleCloseJobPostForm = function () {
        setSelectedJobDetailTemplateObj(null);
        setShowJobPostForm(false);
        setSelectedTemplateName(null);
        setSelectedTemplateLabel("--select--");
    };

    const handleJobDetailTemplateSelect = function (index) {
        var templateName = availableJobDetailTemplates[index].jobDetailFormTemplateName;
        var templateLabel = availableJobDetailTemplates[index].jobDetailFormTemplateLabel;
        setCreateJobDTO({
            ...createJobDTO,
            serviceType: selectedServiceTypeObj.KEY,
            templateName: templateName
        });
        setSelectedTemplateName(templateName);
        setSelectedTemplateLabel(templateLabel);
        dispatch(getJobDetailFormData(templateName, onGetJobDetailFormDataResult)
        );
    };

    const handleSelectServiceTypeChange = function (selectedServiceTypeKey) {
        var serviceTypeObj = SERVICE_TYPE[selectedServiceTypeKey].FORM;
        setSelectedServiceTypeObj(serviceTypeObj);
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
        if(!createJobDTO.jobDetails || Object.keys(createJobDTO.jobDetails).length===0){
            toast.error("Please select a job type from the dropdown and fill in the details to create a new post.");
        }
        else{
            setIsLoading(true);
            dispatch(postNewJob(createJobDTO, onPostResult));
        }
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
            setSelectedJobDetailTemplateObj(response.data);
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
            setSelectedJobDetailTemplateObj(null);
            setCreateJobDTO(initialCreateJobDTO);
            setIsLoading(false);
            setShowJobPostForm(false);
        } else {
            setIsLoading(false);
            if (!result.response) {
                toast.error("unknown error occurred!");
                return;
            }
            if(result.response.status===403){
                toast.error("This operation needs you to login first!");
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
                                                    autoComplete={false}
                                                    onKeyPress={allowOnlyNumbers}
                                                    onChange={(e) => {
                                                        formatCurrency(e, element.minValue, element.maxValue, handleOnChangeFormElement);
                                                    }}
                                                    isInvalid={fieldHasError(element.name, formErrors)}
                                                />
                                                <Form.Control.Feedback type="isInvalid" style={{ color: "red" }}>
                                                    {getFieldErrorMessage(element.name, formErrors)}
                                                </Form.Control.Feedback>
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
                                                isInvalid={fieldHasError(element.name, formErrors)}
                                            />
                                            <Form.Control.Feedback type="isInvalid" style={{ color: "red" }}>
                                                {getFieldErrorMessage(element.name, formErrors)}
                                            </Form.Control.Feedback>
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
                                            isInvalid={fieldHasError(element.name, formErrors)}
                                        />
                                        <Form.Control.Feedback type="isInvalid" style={{ color: "red" }}>
                                            {getFieldErrorMessage(element.name, formErrors)}
                                        </Form.Control.Feedback>
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
                                            defaultValue={element.defaultValue}
                                            onChange={handleOnChangeFormElement}
                                            isInvalid={fieldHasError(element.name, formErrors)}
                                        >
                                            {element.options.map((option, index) => {
                                                return <option>{option}</option>;
                                            })}
                                        </Form.Control>
                                        <Form.Control.Feedback type="isInvalid" style={{ color: "red" }}>
                                            {getFieldErrorMessage(element.name, formErrors)}
                                        </Form.Control.Feedback>
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
                                            isInvalid={fieldHasError(element.name, formErrors)}
                                        />
                                        <Form.Control.Feedback type="isInvalid" style={{ color: "red" }}>
                                            {getFieldErrorMessage(element.name, formErrors)}
                                        </Form.Control.Feedback>
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
                    <Modal.Title style={{ color: "GrayText" }}>{JOB_CREATE_LABEL}</Modal.Title>
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
                                    title={formLabel}
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
                                    selectedJobDetailTemplateObj,
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
                            text="Post"
                        />
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={isLoading}
                        onClick={handleCloseJobPostForm}
                    >
                        Cancel
          </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
