import React, { useEffect, useState } from 'react';
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

export function JobDetailView(props) {

    useEffect(()=>{
        console.log("job detail view open with : "+JSON.stringify(props.job));
    },[]);
    
    const renderDetails=function(job){
        
    }

    return (
        <>
         {renderDetails(props.job)}
        </>
    );

}