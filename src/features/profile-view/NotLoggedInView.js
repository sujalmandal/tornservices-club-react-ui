import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal,Form, FormControl, Container } from 'react-bootstrap';
import { login } from './NotLoggedInViewSlice';
import {
    updateApiKey,
    selectPlayerInfo
} from '../shared-vars/SharedCacheSlice';

export function NotLoggedInView() {

    const dispatch = useDispatch();

    /* redux, global states */
    const globalPlayerInfo = useSelector(selectPlayerInfo);

    const [lgShow, setLgShow] = useState(false);

    const setAPIKey = function(e){
        dispatch(updateApiKey(e.target.value))
    }

    return (
        <div>
            <Button onClick={() => setLgShow(true)} variant="outline-success" >Login</Button>
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
                        <FormControl  defaultValue={globalPlayerInfo.apiKey} type="text" className="mr-sm-4" onChange={setAPIKey} />
                        <Button variant="outline-success" >Login!</Button>
                    </Form>
                    </Container>
                </Modal.Body>
            </Modal>
        </div>
    );

}