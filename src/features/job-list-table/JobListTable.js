import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Card, Button, CardImg, CardTitle, CardText, CardColumns } from 'reactstrap';
import {
    getDetails,
    selectJobs
} from './JobListTableSlice';

export function JobListTable() {

    const dispatch = useDispatch();

    /* redux, global states */
    const globalJobs = useSelector(selectJobs);

    /* local, feature-level states */
    const [selectedJob, setSelectedJob] = useState(null);

    return (
        <div style={{ width:"100vw", background: "#2d405f", minHeight:"100vh", paddingTop:"20vh" }}>
                <CardColumns>
                    { globalJobs.map((job, index) => (
                        <Card key={'card_'+index} body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                            <CardTitle tag="h5">$50,000</CardTitle>
                            <CardText>{job.jobType} {job.targetPlayerName} x {job.amount}</CardText>
                            <CardText>Posted on : 30-03-2021</CardText>
                            <Button>Claim Job !</Button>
                        </Card>    
                    ))}
                </CardColumns>
        </div>
    );

}