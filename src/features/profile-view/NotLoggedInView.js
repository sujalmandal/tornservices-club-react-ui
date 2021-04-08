import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form, FormControl, Container, Row, Col } from 'react-bootstrap';
import { sendLoginRequest } from './NotLoggedInViewSlice';
import {
    updateApiKey,
    updateSharedState,
    selectPlayerInfo,
    initialSharedState

} from '../shared-vars/SharedStateSlice';
import SpinnerText from '../common-components/SpinnerText';
import { toast } from 'react-toastify';

export function NotLoggedInView() {

    const dispatch = useDispatch();

    /* redux, global states */
    const globalPlayerInfo = useSelector(selectPlayerInfo);

    /* local states */
    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const setAPIKey = function (e) {
        dispatch(updateApiKey(e.target.value))
    }

    const handleLogin = function () {
        setIsLoading(true);
        dispatch(updateSharedState({
            ...globalPlayerInfo,
            isLoading: true
        }));
        dispatch(sendLoginRequest(globalPlayerInfo.apiKey, onLoginResult));
    }

    const onLoginResult = function (isSuccess, result) {
        setIsLoading(false);
        setIsLoginPopupOpen(false);
        if (isSuccess) {
            console.log(result.data)
            dispatch(updateSharedState({
                ...globalPlayerInfo,
                ...result.data,
                isLoggedIn: true,
                isLoading: false
            }));
            toast.success("Welcome " + result.data.tornUserName + " !");
            setTimeout(() => { window.location.reload() }, 3000);
        }
        else {
            var error = result.response.data
            if (error) {
                toast.error("Error: " + error.message);
            }
            else {
                toast.error("unknown error occurred!");
            }
            dispatch(updateSharedState(initialSharedState));
        }
    }

    return (
        <div>
            <Button style={{ minWidth: "5vw" }} onClick={() => setIsLoginPopupOpen(true)} variant="outline-success" >Login</Button>
            <Modal
                backdrop="static"
                show={isLoginPopupOpen}
                onHide={() => setIsLoginPopupOpen(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">Login with your torn API key</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Form>
                            <Row>
                                <Col>
                                    <FormControl defaultValue={globalPlayerInfo.apiKey} type="text" className="mr-sm-4" onChange={setAPIKey} disabled={isLoading} />
                                </Col>
                                <Col>
                                    <Button onClick={handleLogin} variant="outline-success" disabled={isLoading}>
                                        <SpinnerText isLoading={isLoading} loadingText="Checking with Ched.." text="Login!" />
                                    </Button>
                                </Col>
                            </Row>
                            
                        </Form>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Container>
                        <Form.Text className="text-muted">
                            <span style={{ color: "gray" }}>
                                Your API key will never be saved in torncityservices.club's database.
                                <br/>The backend code base is opensource. Visit{' '}
                                <a href="https://github.com/sujalmandal/torncityservices-club-rest-api">github codebase</a> to verify!
                            </span>
                        </Form.Text>
                    </Container>
                </Modal.Footer>
            </Modal>
        </div>
    );
}