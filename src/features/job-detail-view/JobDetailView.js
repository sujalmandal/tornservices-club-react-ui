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

export function JobDetailView(props) {

    const renderDetails=function(job){
        
    }

    return (
        <>
         {props.isJobDetailViewOpen?renderDetails(props.job):""} 
        </>
    );

}