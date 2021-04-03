import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';

export default function SpinnerText(props) {
    return (
        <div>
            {props.isLoading ? <div><Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />{props.loadingText}</div> : <div>{props.text}</div>}
        </div>
    );
}