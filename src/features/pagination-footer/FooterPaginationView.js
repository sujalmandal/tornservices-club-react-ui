import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Col, Row, Pagination, Container } from 'react-bootstrap';
import {
    selectSearchRequestObj,
    setSearchResults,
    searchJobsByFilter
} from '../shared-vars/SharedStateSlice';
import { renderFriendlyDate } from '../../utils/AppUtils';
import { toast } from 'react-toastify';

export function FooterPaginationView() {

    const dispatch = useDispatch();
    const searchFiltersRedux=useSelector(selectSearchRequestObj);

    const triggerSearch = function (pageNumber) {
        console.log("search page: " + pageNumber);
        dispatch(searchJobsByFilter(searchFiltersRedux,onSearchResult,dispatch))
    }

    const onSearchResult=(isSuccess,response)=>{
        if (isSuccess) {
            dispatch(setSearchResults(response.data))
        }
        else {
            toast.error("Error: "+response.data.errorMessage);
        }
    }

    return (
        <Container fluid>
            <Row className="justify-content-lg-center">
                <Pagination>
                    <Pagination.First onClick={() => { triggerSearch(1) }} />
                    <Pagination.Prev />
                    <Pagination.Item>{1}</Pagination.Item>
                    <Pagination.Ellipsis />

                    <Pagination.Item>{10}</Pagination.Item>
                    <Pagination.Item>{11}</Pagination.Item>
                    <Pagination.Item active>{12}</Pagination.Item>
                    <Pagination.Item>{13}</Pagination.Item>
                    <Pagination.Item disabled>{14}</Pagination.Item>

                    <Pagination.Ellipsis />
                    <Pagination.Item>{20}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination>
            </Row>
        </Container>
    );

}