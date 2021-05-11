import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CardDeck, Card, Col,Row, Form, Button } from 'react-bootstrap';
import {
    selectSearchResults,
    selectIsSearchLoading
} from '../shared-vars/SharedStateSlice';
import { renderFriendlyDate,getCardBodyText,getCardHeaderText } from '../../utils/AppUtils';
import { SERVICE_TYPE } from '../../constants';
import _ from "lodash";
import { Scrollbars } from 'react-custom-scrollbars';
import { JobDetailView } from '../job-detail-view/JobDetailView';

export function JobListTable() {

    /* redux, global states */
    const searchResults = useSelector(selectSearchResults);
    const isSearchLoading_ReduxState = useSelector(selectIsSearchLoading);
    const jobsToShowPerRow=3;
    const [selectedJob, setSelectedJob]=useState(null);
    const [isJobDetailViewOpen, setIsJobDetailViewOpen]=useState(false);


    const handleViewBtnClicked=function(job){
        setSelectedJob(job);
        setIsJobDetailViewOpen(true);
        console.log("job selected: "+job.seqId);
    }

    const renderResults = (searchResults) => {
        var renderedElements = [];
        if (!searchResults.jobs) {
            console.log("first load");
        }
        else {
            if (searchResults.jobs.length === 0) {
                renderedElements.push(<h4 style={{ color: "white", paddingTop: "30vh" }}>No current offers/requests match your search.</h4>);
            }
            else {
                for (var index = 0; index < searchResults.jobs.length; index = index + jobsToShowPerRow) {
                    var jobsInASingleRow = _(searchResults.jobs).chain().slice(index, index + jobsToShowPerRow).value();
                    renderedElements.push(
                        <CardDeck key={index} style={{ paddingBottom: "3vh" }}>
                            {jobsInASingleRow.map((job, index) => {
                                return <Card key={'card_' + index} body 
                                        style={{ backgroundColor: 'wheat', borderColor: '#333', maxWidth:"30%"}}>
                                    <Card.Header style={{display:"flex",justifyContent: "left"}}>
                                        Service No. #{job.seqId}
                                            <span style={{paddingLeft:"2vw"}} className="text-muted">
                                                posted {renderFriendlyDate(job.postedDate)}
                                            </span>
                                        </Card.Header>
                                    <Card.Body>
                                        <Card.Subtitle>{getCardHeaderText(job)}</Card.Subtitle>
                                        <Row>
                                            <Col>
                                                <Card.Img src="images/mug.png" />
                                            </Col>
                                            <Col>
                                                <Row  style={{textAlign:'left', paddingTop:"0.5vh"}}>
                                                    {getCardBodyText(job)}
                                                </Row>
                                                <Row style={{paddingLeft:"70%",paddingTop:"5%"}}>
                                                    <Button onClick={()=>{handleViewBtnClicked(job)}}>View</Button>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            })}
                        </CardDeck>
                    );
                }
            }
        }
        return renderedElements;
    }

    return (
        <>
            {isJobDetailViewOpen?<JobDetailView isOpen={isJobDetailViewOpen} onClose={()=>{setIsJobDetailViewOpen(false)}} job={selectedJob}/>:""}
            <Col style={{minWidth:"15vw","minHeight":"70vh", maxHeight:"70vh", color:"gray"}}>
                ads space
            </Col>
            <Col style={{minWidth:"70vw","minHeight":"70vh", maxHeight:"70vh"}}>
                {isSearchLoading_ReduxState ? <h5 style={{ color: "white", paddingTop: "30vh" }}>Searching...</h5> :
                    <Scrollbars inverse="false">
                        {renderResults(searchResults)}
                    </Scrollbars>}
            </Col>
            <Col style={{minWidth:"15vw","minHeight":"70vh", maxHeight:"70vh", color:"gray"}}>
                ads space
            </Col>
        </>
    );

}