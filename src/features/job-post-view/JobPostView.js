import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Modal,Form, FormControl, Container } from 'react-bootstrap';
import {
    postNewJob
} from './JobPostViewSlice';

export function JobPostView() {

    const dispatch = useDispatch();

    const [showJobPostForm, setShowJobPostForm] = useState(false);
    const [createJobDTO, setCreateJobDTO] = useState({
        
    });

    return (
        <div>
            <Button onClick={() => { setShowJobPostForm(true) }} variant="outline-success" >Post a new job</Button>
            <Modal
                show={showJobPostForm}
                onHide={() => { setShowJobPostForm(false) }}
                backdrop="static"
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => { setShowJobPostForm(false) }}>Cancel</Button>
                <Button variant="primary" onClick={()=>(dispatch(postNewJob(createJobDTO)))}>Post!</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}