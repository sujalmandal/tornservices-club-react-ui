import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CardDeck, Card, Col,Row, Form, Button } from 'react-bootstrap';
import {
    selectSearchResults,
    selectIsSearchLoading
} from '../shared-vars/SharedStateSlice';
import { renderFriendlyDate } from '../../utils/AppUtils';
import { SERVICE_TYPE } from '../../constants';
import _ from "lodash";
import { Scrollbars } from 'react-custom-scrollbars';

export function JobListTable() {

    /* redux, global states */
    const searchResults = useSelector(selectSearchResults);
    const isSearchLoading_ReduxState = useSelector(selectIsSearchLoading);
    const jobsToShowPerRow=3;

    /* local, feature-level states */
    const [selectedJob, setSelectedJob] = useState(null);

    const getCardBodyText = function(job){
        var text="";
        if(job.listedByPlayerName){
            text+=job.listedByPlayerName+" is";
        }
        else{
            text+="Someone is";
        }
        if(job.serviceType===SERVICE_TYPE.REQUEST.FORM.KEY){
            text+=" requesting for ";
        }
        else if(job.serviceType===SERVICE_TYPE.OFFER.FORM.KEY){
            text+=" offering to ";
        }
        else{
            console.error("Illegal job type.");
        }
        text+=job.templateLabel+".";
        return text;
    }

    const getCardHeaderText=function(job){
        var text="";
        if(job.totalPay){
            text+="Total $"+(job.totalPay+"").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        else if(job.payPerAction){
            text+="Per action $"+(job.payPerAction+"").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        else{
            text+="Unspecified amount";
        }
        return text;
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
                                        <Row>
                                            <Col>
                                                <Card.Img src="images/mug.png" />
                                            </Col>
                                            <Col>
                                                <Row>
                                                    <Card.Subtitle>{getCardHeaderText(job)}</Card.Subtitle>
                                                </Row>
                                                <Row  style={{textAlign:'left', paddingTop:"0.5vh"}}>
                                                    {getCardBodyText(job)}
                                                </Row>
                                                <Row style={{paddingLeft:"70%",paddingTop:"5%"}}>
                                                    <Button>View</Button>
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