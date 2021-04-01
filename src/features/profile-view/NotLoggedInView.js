import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form, FormControl, Container, Spinner, Toast } from 'react-bootstrap';
import { sendLoginRequest } from './NotLoggedInViewSlice';
import {
    updateApiKey,
    updateSharedState,
    selectPlayerInfo,
    selectIsLoading,
    initialSharedState

} from '../shared-vars/SharedStateSlice';
import { toast } from 'react-toastify';

export function NotLoggedInView() {

    const dispatch = useDispatch();

    /* redux, global states */
    const globalPlayerInfo = useSelector(selectPlayerInfo);
    const globalIsLoading = useSelector(selectIsLoading);

    const [lgShow, setLgShow] = useState(false);

    const setAPIKey = function (e) {
        dispatch(updateApiKey(e.target.value))
    }

    const handleLogin = function () {
        dispatch(updateSharedState({
            ...globalPlayerInfo,
            isLoading:true
        }));
        dispatch(sendLoginRequest(globalPlayerInfo.apiKey, onResult));
    }

    const onResult = function (isSuccess, response) {
        if (isSuccess) {
            console.log(response.data)
            dispatch(updateSharedState({
                ...globalPlayerInfo,
                subscriberType: response.data,
                tornPlayerName: response.data.tornUserName,
                tornPlayerId: response.data.tornUserId,
                playerId: response.data.internalId,
                isLoggedIn: true,
                isLoading : false
            }));
            toast.success("Welcome "+response.data.tornUserName+" !");
            setTimeout(()=>{window.location.reload()},3000);
        }
        else {
            console.error(response);
            dispatch(updateSharedState(initialSharedState));
            toast.error("Login failed! Please check your APIKey and try again.");
        }
    }

    return (
        <div>
            <Button style={{ minWidth: "5vw" }} onClick={() => setLgShow(true)} variant="outline-success" >Login</Button>
            <Modal
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">Login with your torn API key</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>
                        <Form inline>
                            <FormControl defaultValue={globalPlayerInfo.apiKey} type="text" className="mr-sm-4" onChange={setAPIKey} />
                            <Button onClick={handleLogin} variant="outline-success" >
                                {globalIsLoading ? <div>Working on it.. <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                /></div> : <div>Login!</div>}
                            </Button>
                        </Form>
                    </Container>
                </Modal.Body>
            </Modal>
        </div>
    );
}