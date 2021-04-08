import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form, FormControl, Container } from 'react-bootstrap';
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
            if(error){
                toast.error("Error: "+error.message);
            }
            else{
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
                    <Container>
                        <Form inline>
                            <FormControl defaultValue={globalPlayerInfo.apiKey} type="text" className="mr-sm-4" onChange={setAPIKey} disabled={isLoading} />
                            <Button onClick={handleLogin} variant="outline-success" disabled={isLoading}>
                                <SpinnerText isLoading={isLoading} loadingText="Checking your identity.." text="Login!" />
                            </Button>
                        </Form>
                    </Container>
                </Modal.Body>
            </Modal>
        </div>
    );
}