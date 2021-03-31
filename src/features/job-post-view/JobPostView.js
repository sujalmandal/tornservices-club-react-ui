import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'reactstrap';
import {
    postNewJob
} from './JobPostViewSlice';

export function JobPostView() {

    const dispatch = useDispatch();

    const [showJobPostForm, setShowJobPostForm] = useState(false);

    return (
        <div>
            <Button onClick={() => { setShowJobPostForm(true) }} variant="outline-success" >Post a new job</Button>
        </div>
    );

}