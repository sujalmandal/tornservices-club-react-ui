import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Card, Button, CardImg, CardTitle, CardText, CardColumns } from 'reactstrap';
import {
    searchJobs,
    selectJobs
} from './JobListTableSlice';
import styles from './JobListTable.module.css';

export function JobListTable() {

    const dispatch = useDispatch();

    /* redux, global states */
    const globalJobs = useSelector(selectJobs);

    /* local, feature-level states */
    const [selectedJob, setSelectedJob] = useState(null);

    return (
        <div style={{ height: "100%", background: "#2d405f", minHeight:"100vh" }}>
            <Container style={{ paddingTop: "100px" }}  >
                <CardColumns>
                    { globalJobs.map((job, index) => (
                        <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                            <CardTitle tag="h5">$50,000</CardTitle>
                            <CardText>{job.jobType} {job.targetPlayerName} x {job.amount}</CardText>
                            <CardText>Posted on : 30-03-2021</CardText>
                            <Button>Claim Job !</Button>
                        </Card>    
                    ))}
                </CardColumns>
            </Container>
        </div>
    );

}