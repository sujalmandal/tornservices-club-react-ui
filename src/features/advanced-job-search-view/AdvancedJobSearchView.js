import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, Form, FormControl, Container, Col, Row } from 'react-bootstrap';
import { } from './AdvancedJobSearchViewSlice';
import {
    SERVICE_TYPE,
    CURRENCY_FORMAT,
    INPUT_TYPES
} from '../../constants';
import NumberFormat from 'react-number-format';
import SpinnerText from '../common-components/SpinnerText';
import { toast } from 'react-toastify';
import { validateNumberFormat } from '../../utils/AppUtils';
import _ from "lodash";
import {
    setSearchResults,
    advancedSearchJobsByFilter,
    selectIsSearchLoading,
    setAdvancedSearchReqObj
} from '../shared-vars/SharedStateSlice';

export function AdvancedJobSearchView(props) {

    const dispatch = useDispatch();
    const isSearchLoading_ReduxState = useSelector(selectIsSearchLoading);
    const [selectedServiceTypeObj, setServiceType] = useState(SERVICE_TYPE.REQUEST.FORM);
    const [localSearchObj, setLocalSearchObj] = useState({
        "serviceType": "ALL",
        "postedXDaysAgo": 3,
        "filterFields": [],
        "filterTemplateName": ""
    });

    const handleSelectServiceTypeChange = function (selectedServiceTypeKey) {
        setServiceType(SERVICE_TYPE[selectedServiceTypeKey].FORM);
    }

    /* init */
    useEffect(() => {
        if (props.isOpen) {
            console.log("opening advanced search dialog --");
            console.log("selected template : " + JSON.stringify(props.jobDetailFilterTemplate))
            console.log("selected serviceType: " + selectedServiceTypeObj.KEY);
            setLocalSearchObj({
                ...localSearchObj,
                filterTemplateName: props.jobDetailFilterTemplate.filterTemplateName,
                serviceType:selectedServiceTypeObj.KEY
            });
        }
    }, [props.isOpen])

    /* update global search object */
    useEffect(()=>{
        dispatch(setAdvancedSearchReqObj(localSearchObj));
    },[localSearchObj]);



    /* event handlers */

    const handleOnChangeFormElement = function (fieldValue, fieldName, groupName, fieldType) {
        //var fieldValue = e.target.value;
        fieldValue = fieldValue.replaceAll('$', '');
        fieldValue = fieldValue.replaceAll(',', '');
        /*var fieldName = e.target.name;
        var fieldType = e.target.type;
        var groupName = e.target.groupName;*/

        var filterFields = [...localSearchObj.filterFields];

        var filterFieldObj = {
            "type": fieldType,
            "name": fieldName,
            "groupName": groupName,
            "value": fieldValue
        };

        var previousIndex = _.findIndex(filterFields, { 'name': fieldName });
        //new element
        if (previousIndex === -1) {
            console.log("adding new search filter: "+JSON.stringify(filterFieldObj));
            filterFields.push(filterFieldObj);
        }
        //replace existing element
        else {
            console.log("updating search filter : "+JSON.stringify(filterFieldObj));
            filterFields[previousIndex] = filterFieldObj;
        }
        //filterFields=_.uniqBy(filterFields, 'name');
        setLocalSearchObj({
            ...localSearchObj,
            "filterFields": filterFields
        });
    }

    const handleAdvancedSearch = function () {
        props.onClose();
        console.log("triggering search with the following parameters: " + JSON.stringify(localSearchObj));
        dispatch(advancedSearchJobsByFilter(localSearchObj, onHandleAdvancedSearchResult, dispatch))
    }

    const onHandleAdvancedSearchResult = function (isSuccess, response) {
        if (isSuccess) {
            console.log("advanced search results: " + JSON.stringify(response.data.jobs));
            dispatch(setSearchResults(response.data));
        }
        else {

            toast.error("Error: "+response.data.errorMessage);
        }
    }

    /***** dynamic filter form renderer start *****/
    const renderDynamicFilter = function (jobDetailFilterTemplate, selectedServiceTypeKey) {
        console.log("rendering form based on template...");
        console.log("service type: " + selectedServiceTypeKey)
        var renderedElements = [];
        var groupedElements = {};


        if (jobDetailFilterTemplate != null) {

            jobDetailFilterTemplate.filterElements.forEach((element) => {
                if (element.serviceType === SERVICE_TYPE.ALL || element.serviceType === selectedServiceTypeObj.KEY) {
                    if (!groupedElements[element.groupName]) {
                        groupedElements[element.groupName] = [];
                    }
                    groupedElements[element.groupName].push(element);
                }
            });

            for (const [groupName, elementArr] of Object.entries(groupedElements)) {
                /* text or checkbox */
                if (elementArr.length == 1) {
                    if (elementArr[0].fieldType === INPUT_TYPES.SELECT) {
                        renderedElements.push(
                            <Row key={'row_' + groupName + "_" + elementArr[0].fieldName}>
                                <Container>
                                    <Col>
                                        <Row><Form.Label>{elementArr[0].fieldLabel}</Form.Label></Row>
                                        <Row><Form.Control as="select" defaultValue={elementArr[0].defaultValue}
                                            name={elementArr[0].fieldName}
                                            onChange={(e) => {
                                                handleOnChangeFormElement(
                                                    e.target.value,
                                                    elementArr[0].fieldName,
                                                    elementArr[0].groupName,
                                                    elementArr[0].fieldType);
                                            }}
                                            groupName={elementArr[0].groupName}>
                                            {elementArr[0].options.map((option, index) => {
                                                return <option key={index}>{option}</option>;
                                            })}
                                        </Form.Control></Row>
                                    </Col>
                                </Container>
                            </Row>);
                    }
                    else {
                        renderedElements.push(
                            <Row key={'row_' + groupName + "_" + elementArr[0].fieldName}>
                                <Col>
                                    <Form.Label className="mr-sm-4">{elementArr[0].fieldLabel}</Form.Label>
                                    <FormControl id={elementArr[0].id} style={{ width: "10vw" }}
                                        type={elementArr[0].fieldType} name={elementArr[0].fieldName}
                                        min={elementArr[0].minValue} max={elementArr[0].maxValue}
                                        defaultValue={elementArr[0].defaultValue} groupName={elementArr[0].groupName}
                                        size="sm" className="mr-sm-4"
                                        onChange={(e) => {
                                            handleOnChangeFormElement(
                                                e.target.value,
                                                elementArr[0].fieldName,
                                                elementArr[0].groupName,
                                                elementArr[0].fieldType);
                                        }}
                                    />
                                </Col>
                            </Row>
                        );
                    }
                }
                /* number (min & max) */
                if (elementArr.length === 2 && elementArr[0].fieldType === INPUT_TYPES.NUMBER && elementArr[1].fieldType === INPUT_TYPES.NUMBER) {
                    if (elementArr[0].format === CURRENCY_FORMAT && elementArr[1].format === CURRENCY_FORMAT) {
                        renderedElements.push(
                            <Row key={'row_' + groupName + "_" + elementArr[0].fieldName}>
                                <Col>
                                    <Form.Label className="mr-sm-4">{elementArr[0].fieldLabel}</Form.Label>
                                    <NumberFormat style={{ width: "10vw" }} name={elementArr[0].fieldName}
                                        className=".mr-sm-4 form-control form-control-sm" thousandSeparator={true} prefix={'$'}
                                        isAllowed={(valObj) => { return validateNumberFormat(valObj, elementArr[0].maxValue, elementArr[0].minValue) }}
                                        min={elementArr[0].minValue} max={elementArr[0].maxValue}
                                        defaultValue={elementArr[0].defaultValue} groupName={elementArr[0].groupName}
                                        onChange={(e) => {
                                            handleOnChangeFormElement(
                                                e.target.value,
                                                elementArr[0].fieldName,
                                                elementArr[0].groupName,
                                                elementArr[0].fieldType);
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <Form.Label className="mr-sm-4">{elementArr[1].fieldLabel}</Form.Label>
                                    <NumberFormat className=".form-control-sm" style={{ width: "10vw" }} name={elementArr[1].fieldName}
                                        className=".mr-sm-4 form-control form-control-sm" thousandSeparator={true} prefix={'$'}
                                        isAllowed={(valObj) => { return validateNumberFormat(valObj, elementArr[1].maxValue, elementArr[1].minValue) }}
                                        min={elementArr[1].minValue} max={elementArr[1].maxValue}
                                        defaultValue={elementArr[1].defaultValue} groupName={elementArr[1].groupName}
                                        onChange={(e) => {
                                            handleOnChangeFormElement(
                                                e.target.value,
                                                elementArr[1].fieldName,
                                                elementArr[1].groupName,
                                                elementArr[1].fieldType);
                                        }}
                                    />
                                </Col>
                            </Row>);
                    }
                    else {
                        renderedElements.push(
                            <Row key={'row_' + groupName + "_" + elementArr[0].fieldName}>
                                <Col>
                                    <Form.Label className="mr-sm-4">{elementArr[0].fieldLabel}</Form.Label>
                                    <FormControl id={elementArr[0].id}
                                        style={{ width: "10vw" }} type="number" name={elementArr[0].fieldName}
                                        size="sm" className="mr-sm-4"
                                        min={elementArr[0].minValue} max={elementArr[0].maxValue}
                                        defaultValue={elementArr[0].defaultValue} groupName={elementArr[0].groupName}
                                        onChange={(e) => {
                                            handleOnChangeFormElement(
                                                e.target.value,
                                                elementArr[0].fieldName,
                                                elementArr[0].groupName,
                                                elementArr[0].fieldType);
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <Form.Label className="mr-sm-4">{elementArr[1].fieldLabel}</Form.Label>
                                    <FormControl id={elementArr[1].id}
                                        style={{ width: "10vw" }} type="number" name={elementArr[1].fieldName}
                                        size="sm" className="mr-sm-4"
                                        min={elementArr[1].minValue} max={elementArr[1].maxValue}
                                        defaultValue={elementArr[1].defaultValue} groupName={elementArr[1].groupName}
                                        onChange={(e) => {
                                            handleOnChangeFormElement(
                                                e.target.value,
                                                elementArr[1].fieldName,
                                                elementArr[1].groupName,
                                                elementArr[1].fieldType);
                                        }}
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
                        <Row style={{ paddingTop: "2vh" }}>
                            <Form inline>
                                <Container style={{ paddingLeft: "2vw" }}>
                                    <Row>
                                        <Form.Text className="text-muted">
                                            <span style={{ color: "gray" }}>Please fill the items you want. You can leave the ones you don't want empty.</span>
                                        </Form.Text>
                                    </Row>
                                    <Row style={{ paddingTop: "0.5vw" }}>
                                        <Col>
                                            {props.isOpen ? renderDynamicFilter(props.jobDetailFilterTemplate, selectedServiceTypeObj.KEY) : ""}
                                        </Col>
                                    </Row>
                                </Container>
                            </Form>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAdvancedSearch} disabled={isSearchLoading_ReduxState}>
                        <SpinnerText isLoading={isSearchLoading_ReduxState} loadingText="Working on it.." text="Advanced Search" />
                    </Button>
                    <Button variant="secondary" disabled={isSearchLoading_ReduxState} onClick={() => { props.onClose() }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}