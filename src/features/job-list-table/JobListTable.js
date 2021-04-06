import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, CardDeck, Card, Row, Col, Form, Button } from 'react-bootstrap';
import {
    selectSearchResults
} from '../shared-vars/SharedStateSlice';
import { renderFriendlyDate } from '../../utils/AppUtils';
import _ from "lodash";
import { Scrollbars } from 'react-custom-scrollbars';

export function JobListTable() {

    const dispatch = useDispatch();

    /* redux, global states */
    const searchResults = useSelector(selectSearchResults);

    /* local, feature-level states */
    const [selectedJob, setSelectedJob] = useState(null);


    const renderResults=(searchResults)=>{
        var renderedElements=[];
        if(searchResults.jobs){
            for(var index=0;index<searchResults.jobs.length;index=index+3){
                var threeJobs=_(searchResults.jobs).chain().slice(index,index+3).value();
                renderedElements.push(
                    <CardDeck style={{paddingBottom:"3vh"}}>
                        {threeJobs.map((job,index)=>{
                            return <Card key={'card_' + index} body inverse style={{ backgroundColor: '#333', borderColor: '#333', maxWidth: "20vw" }}>
                            <Card.Title tag="h5">{job.serviceType + ' ' + job.templateName}</Card.Title>
                            <Card.Text>{job.jobType} {job.listedByPlayerId} x {job.amount}</Card.Text>
                            <Form.Text>
                                <span className="text-muted" style={{ color: "gray" }}>
                                    posted on {renderFriendlyDate(job.postedDate)} by {job.listedByPlayerName}
                                </span>
                            </Form.Text>
                            <Button>Claim Job !</Button>
                        </Card>
                        })}
                    </CardDeck>
                );
            }
        }
        return renderedElements;
    }

    return (
        <Container>
            <Scrollbars>
                {renderResults(searchResults)}
            </Scrollbars>
        </Container>
    );

}