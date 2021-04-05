import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Card, Button, CardImg, CardTitle, CardText, CardColumns } from 'reactstrap';
import { Form, Col, Row } from 'react-bootstrap';
import {
    selectSearchResults
} from './JobListTableSlice';
import {renderFriendlyDate} from '../../utils/AppUtils';

export function JobListTable() {

    const dispatch = useDispatch();

    /* redux, global states */
    const searchResults = useSelector(selectSearchResults);

    /* local, feature-level states */
    const [selectedJob, setSelectedJob] = useState(null);

    return (
        <div style={{ width: "100vw", background: "#2d405f", minHeight: "100vh", paddingTop: "20vh" }}>
            <Container>
                <CardColumns>
                    {searchResults.map((job, index) => (
                        <Card key={'card_' + index} body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                            <CardTitle tag="h5">{job.serviceType+' '+job.templateName}</CardTitle>
                            <CardText>{job.jobType} {job.listedByPlayerId} x {job.amount}</CardText>
                            <Form.Text>
                                <span className="text-muted" style={{ color: "gray" }}>
                                    posted on {renderFriendlyDate(job.postedDate)} by {job.listedByPlayerName}
                                </span>
                            </Form.Text>
                            <Button>Claim Job !</Button>
                        </Card>
                    ))}
                </CardColumns>
            </Container>
        </div>
    );

}