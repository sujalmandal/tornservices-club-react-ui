import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal,Form, FormControl, Container } from 'react-bootstrap';
import { sendLoginRequest } from './NotLoggedInViewSlice';
import {
    updateApiKey,
    updateSharedCache,
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

    const onResult=function(isSuccess,response){
        if(isSuccess){
            console.log(response.data)
            dispatch(updateSharedCache({
                ...globalPlayerInfo,
                subscriberType: response.data,
                tornPlayerName: response.data.tornUserName,
                tornPlayerId: response.data.tornUserId,
                playerId: response.data.internalId,
                isLoggedIn: true
            }));
        }
        else{
            console.error(response);
            dispatch(updateSharedCache({
                ...globalPlayerInfo,
                subscriberType: "",
                tornPlayerName: "",
                tornPlayerId: "",
                playerId: "",
                isLoggedIn: false
            }));
        }
    }

    return (
        <div>
            <Button style={{minWidth:"5vw"}} onClick={() => setLgShow(true)} variant="outline-success" >Login</Button>
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
                        <Button onClick={()=>{dispatch(sendLoginRequest(globalPlayerInfo.apiKey,onResult))}}variant="outline-success" >Login!</Button>
                    </Form>
                    </Container>
                </Modal.Body>
            </Modal>
        </div>
    );

}