import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Col, Row, Pagination, Container } from 'react-bootstrap';
import {
    selectSearchRequestObj,
    setSearchResults,
    searchJobsByFilter,
    selectPaginationDetails,
    searchByPageNumber
} from '../shared-vars/SharedStateSlice';
import { renderFriendlyDate } from '../../utils/AppUtils';
import { toast } from 'react-toastify';

export function FooterPaginationView() {

    const dispatch = useDispatch();
    const searchFiltersRedux=useSelector(selectSearchRequestObj);
    const paginationInfo = useSelector(selectPaginationDetails);
    const [currentPage,setCurrentPage] = useState(1);

    useEffect(()=>{
        console.log("paginationInfo: "+JSON.stringify(paginationInfo));
    },[]);

    useEffect(()=>{
        triggerSearch(currentPage);
    },[currentPage]);

    const triggerSearch = function (pageNumber) {
        console.log("search page: " + pageNumber);
        dispatch(searchByPageNumber(pageNumber,searchFiltersRedux,onSearchResult,dispatch))
    }

    const handleUpdateCurrentPage=function(pageNumber){
        if(pageNumber>0 && pageNumber<=paginationInfo.totalPages){
            setCurrentPage(pageNumber);
        }
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
                {paginationInfo?
                <Pagination>
                    <Pagination.First onClick={() => { handleUpdateCurrentPage(1) }}/>
                    <Pagination.Prev onClick={() => { handleUpdateCurrentPage(currentPage-1) }}/>
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next onClick={() => { handleUpdateCurrentPage(currentPage+1) }}/>
                    <Pagination.Last onClick={() => { handleUpdateCurrentPage(paginationInfo.totalPages) }}/>
                </Pagination>:""}
            </Row>
        </Container>
    );

}