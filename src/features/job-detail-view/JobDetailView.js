import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { CardDeck, Card, Col, Row, Form, Button, Modal, Container, Table } from 'react-bootstrap';
import {
    getJobById
} from './JobDetailViewSlice';
import { renderFriendlyDate, getCardBodyText, getCardHeaderText } from '../../utils/AppUtils';
import { SERVICE_TYPE, INPUT_TYPES, CURRENCY_FORMAT } from '../../constants';
import SpinnerText from "../common-components/SpinnerText";
import { toast } from "react-toastify";
import _ from "lodash";
import styles from './JobDetailView.module.css';

export function JobDetailView(props) {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [jobData, setJobData] = useState(null);

    useEffect(() => {
        console.log("job detail view open with : " + JSON.stringify(props.job));
        dispatch(getJobById(props.job.seqId, onGetJobByIdResult));
    }, []);

    useEffect(() => {
        console.log("details: " + JSON.stringify(jobData));
    }, [jobData]);

    const onGetJobByIdResult = function (isSuccess, result) {
        console.log("onGetJobByIdResult() result received!");
        setIsLoading(false);
        if (isSuccess) {
            setJobData(result.data.jobs[0]);
        } else {
            props.onClose();
            if (!result.response) {
                toast.error("unknown error occurred!");
                return;
            }
            if (result.response.status === 403) {
                toast.error("This operation needs you to login first!");
            }
            var error = result.response.data;
            if (error) {
                toast.error("Error: " + error.message);
            }
        }
    }

    const handleAcceptJob = () => {

    }

    const renderDetails = function () {
        var renderedElements = [];
        jobData.details.fields.forEach(element => {
            var label = element.label;
            if (element.labelRequest && jobData.serviceType === SERVICE_TYPE.REQUEST.FORM.KEY) {
                label = element.labelRequest;
            }
            if (element.labelOffer && jobData.serviceType === SERVICE_TYPE.OFFER.FORM.KEY) {
                label = element.labelOffer;
            }
            if (element.type.toUpperCase() === INPUT_TYPES.NUMBER) {
                var formattedValue = (element.value + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                if (element.format.toUpperCase() === CURRENCY_FORMAT) {
                    formattedValue = "$" + formattedValue;
                }
                renderedElements.push(<tr>
                    <td>{label}</td>
                    <td>{formattedValue}</td>
                </tr>);
            }
            else {
                renderedElements.push(<tr>
                    <td>{label}</td>
                    <td>{element.value}</td>
                </tr>);
            }
        });
        return renderedElements;
    }

    return (
        <>
            {!isLoading && jobData !== null ?
                <Modal
                    dialogClassName="myColor"
                    size="lg"
                    show={props.isOpen}
                    onHide={() => {
                        props.onClose()
                    }}>

                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: "GrayText" }}>Job #{jobData.seqId}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Container fluid style={{ padding: "2rem" }}>
                            <h5>{getCardBodyText(jobData)}</h5>
                            <Table striped bordered hover variant="dark">
                                <tbody>
                                    {renderDetails()}
                                </tbody>
                            </Table>
                        </Container>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="primary"
                            onClick={handleAcceptJob}
                            disabled={isLoading}>
                            <SpinnerText
                                isLoading={isLoading}
                                loadingText="Working on it.."
                                text="Accept Job">
                            </SpinnerText>
                        </Button>
                        <Button
                            variant="secondary"
                            disabled={isLoading}
                            onClick={() => { props.onClose() }}
                        >
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
                : ""}
        </>
    );

}