import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function SpinnerText(props) {
    return (
        <div>
            {props.isLoading ? <div>{props.loadingText}{' '}<Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            /></div> : <div>{props.text}</div>}
        </div>
    );
}